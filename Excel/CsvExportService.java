package com.iga.mawaeed.service.Excel;

import com.iga.mawaeed.entity.*;
import com.iga.mawaeed.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import java.io.StringWriter;
import java.io.PrintWriter;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Stream;

@Service
@Transactional(readOnly = true)
public class CsvExportService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private ClearingAgentAppointmentRepository clearingAgentRepository;

    @Autowired
    private QueueLogRepository queueLogRepository;

    @Autowired
    private SiteInfoRepository siteInfoRepository;

    public String generateCsv(ExportRequest request) {
        StringWriter stringWriter = new StringWriter();
        PrintWriter writer = new PrintWriter(stringWriter);

        // Add BOM for UTF-8 to ensure proper Arabic text display
        writer.print("\uFEFF");

        // Generate CSV based on tab type
        switch (request.getTabType()) {
            case "viewAll" -> generateOverviewCsv(writer, request);
            case "Appointments" -> generateAppointmentsCsv(writer, request);
            case "viewPeriodReport" -> generatePeriodReportCsv(writer, request);
            case "viewTicketsAttendance" -> generateTicketsAttendanceCsv(writer, request);
            case "viewOverallAnalysis" -> generateOverallAnalysisCsv(writer, request);
            default -> generateDefaultCsv(writer, request);
        }

        writer.flush();
        return stringWriter.toString();
    }

    private void generateOverviewCsv(PrintWriter writer, ExportRequest request) {
        LocalDate startDate = LocalDate.parse(request.getStartDate());
        LocalDate endDate = LocalDate.parse(request.getEndDate());

        writer.println("تقرير نظرة عامة");
        writer.println("الفرع: " + getBranchName(request.getBranchId()));
        writer.println("من تاريخ: " + request.getStartDate());
        writer.println("إلى تاريخ: " + request.getEndDate());

        // Get site information
        Optional<SiteInfo> siteOpt = siteInfoRepository.findActiveBySiteId(request.getBranchId().intValue());
        if (siteOpt.isPresent()) {
            SiteInfo site = siteOpt.get();
            writer.printf("ساعات العمل: من %s إلى %s%n",
                    site.getStartTime(), site.getEndTime());
            writer.printf("عدد الموظفين: %d%n", site.getEmployeeCount());
            writer.printf("عدد الكاونترات: %d%n", site.getCountersCount());
        }
        writer.println();

        // Calculate statistics from actual data
        writer.println("الإحصائيات الرئيسية");
        writer.println("المؤشر,القيمة,الوصف");

        // Get appointment counts
        Integer clientAppointments = appointmentRepository.countBySiteAndDateRange(
                request.getBranchId(), startDate, endDate);
        Integer agentAppointments = clearingAgentRepository.countBySiteAndDateRange(
                request.getBranchId(), startDate, endDate);
        Integer totalAppointments = clientAppointments + agentAppointments;

        // Get printed tickets
        Integer printedTickets = queueLogRepository.getTotalPrintedTickets(
                request.getBranchId(), startDate, endDate);
        if (printedTickets == null)
            printedTickets = 0;

        // Get printed appointments
        long printedAppointments = appointmentRepository.countPrintedBySiteAndDateRange(
                request.getBranchId(), startDate, endDate);

        writer.printf("\"إجمالي المواعيد\",\"%d\",\"مواعيد عملاء + مخلصين\"%n", totalAppointments);
        writer.printf("\"مواعيد العملاء\",\"%d\",\"المواعيد المباشرة\"%n", clientAppointments);
        writer.printf("\"مواعيد المخلصين\",\"%d\",\"المواعيد عبر المخلصين\"%n", agentAppointments);
        writer.printf("\"التذاكر المطبوعة\",\"%d\",\"من سجل الطوابير\"%n", printedTickets);
        writer.printf("\"مواعيد مطبوعة\",\"%d\",\"مواعيد تم طباعتها\"%n", printedAppointments);

        // Calculate attendance rate
        double attendanceRate = totalAppointments > 0 ? (printedTickets * 100.0 / totalAppointments) : 0.0;
        writer.printf("\"معدل الحضور\",\"%.1f%%\",\"نسبة الحضور الفعلي\"%n", attendanceRate);

        writer.println();

        // Branch status summary
        writer.println("حالة الفرع");
        writer.println("المؤشر,الحالة");
        writer.printf("\"الفرع\",\"%s\"%n",
                siteOpt.isPresent() && siteOpt.get().getActiveFlag() ? "نشط" : "غير نشط");
        writer.printf("\"فترة التقرير\",\"%d أيام\"%n",
                java.time.temporal.ChronoUnit.DAYS.between(startDate, endDate) + 1);
        writer.printf("\"متوسط المواعيد اليومية\",\"%.1f\"%n",
                totalAppointments
                        / (double) Math.max(1, java.time.temporal.ChronoUnit.DAYS.between(startDate, endDate) + 1));
    }

    private void generateAppointmentsCsv(PrintWriter writer, ExportRequest request) {
        LocalDate startDate = LocalDate.parse(request.getStartDate());
        LocalDate endDate = LocalDate.parse(request.getEndDate());

        writer.println("تقرير المواعيد");
        writer.println("الفرع: " + getBranchName(request.getBranchId()));
        writer.println("من تاريخ: " + request.getStartDate());
        writer.println("إلى تاريخ: " + request.getEndDate());

        // Get site info for validation
        Optional<SiteInfo> siteOpt = siteInfoRepository.findActiveBySiteId(request.getBranchId().intValue());
        if (siteOpt.isEmpty()) {
            writer.println("خطأ: الفرع المحدد غير موجود أو غير نشط");
            return;
        }

        writer.println();

        // Query filters
        Map<String, Object> filters = request.getFilters();
        boolean includeClientAppointments = filters == null ||
                !Boolean.FALSE.equals(filters.get("includeClientAppointments"));
        boolean includeAgentAppointments = filters == null ||
                !Boolean.FALSE.equals(filters.get("includeAgentAppointments"));

        // Client Appointments Section
        if (includeClientAppointments) {
            writer.println("مواعيد العملاء المباشرة");
            writer.println(
                    "الرقم الشخصي,تاريخ الموعد,وقت الموعد,حالة الطباعة,رقم الهاتف,البريد الإلكتروني,عدد الأشخاص,نوع الجنسية");

            try (Stream<Appointment> appointmentStream = appointmentRepository
                    .streamBySiteAndDateRange(request.getBranchId(), startDate, endDate)) {

                appointmentStream.forEach(appointment -> {
                    writer.printf("\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%d\",\"%s\"%n",
                            escapeCSV(String.valueOf(appointment.getApplicantCPR())),
                            appointment.getAppDate(),
                            appointment.getAppTime(),
                            appointment.getTimePrint() != null ? "مطبوع" : "غير مطبوع",
                            appointment.getPhoneNumber() != 0 ? String.valueOf(appointment.getPhoneNumber())
                                    : "غير محدد",
                            escapeCSV(appointment.getEmail() != null ? appointment.getEmail() : "غير محدد"),
                            appointment.getCountOfCPR(),
                            appointment.isBhOrGCC() ? "بحريني/خليجي" : "أجنبي");
                });
            }
            writer.println();
        }

        // Clearing Agent Appointments Section
        if (includeAgentAppointments) {
            writer.println("مواعيد المخلصين الجمركيين");
            writer.println(
                    "رقم المخلص الشخصي,تاريخ الموعد,وقت الموعد,حالة الطباعة,رقم الهاتف,البريد الإلكتروني,عدد العملاء,أرقام العملاء");

            try (Stream<ClearingAgentAppointment> agentStream = clearingAgentRepository
                    .streamBySiteAndDateRange(request.getBranchId(), startDate, endDate)) {

                agentStream.forEach(agentAppointment -> {
                    // Convert CPR array to comma-separated string
                    String cprList = "";
                    if (agentAppointment.getCprToProcess() != null && agentAppointment.getCprToProcess().length > 0) {
                        cprList = String.join(", ", agentAppointment.getCprToProcess());
                    }

                    writer.printf("\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%d\",\"%s\"%n",
                            escapeCSV(String.valueOf(agentAppointment.getApplicantCpr())),
                            agentAppointment.getAppointmentDate(),
                            agentAppointment.getAppointmentTime(),
                            agentAppointment.getTimePrint() != null ? "مطبوع" : "غير مطبوع",
                            agentAppointment.getPhone() != 0 ? String.valueOf(agentAppointment.getPhone()) : "غير محدد",
                            escapeCSV(agentAppointment.getEmail() != null ? agentAppointment.getEmail() : "غير محدد"),
                            agentAppointment.getCprCount(),
                            escapeCSV(cprList));
                });
            }
            writer.println();
        }

        // Summary Section
        writer.println("ملخص المواعيد");
        writer.println("نوع الموعد,العدد الكلي,المطبوع,غير المطبوع");

        long clientTotal = appointmentRepository.countBySiteAndDateRange(request.getBranchId(), startDate, endDate);
        long clientPrinted = appointmentRepository.countPrintedBySiteAndDateRange(request.getBranchId(), startDate,
                endDate);
        long agentTotal = clearingAgentRepository.countBySiteAndDateRange(request.getBranchId(), startDate, endDate);

        writer.printf("\"المواعيد المباشرة\",\"%d\",\"%d\",\"%d\"%n",
                clientTotal, clientPrinted, clientTotal - clientPrinted);
        writer.printf("\"مواعيد المخلصين\",\"%d\",\"--\",\"--\"%n", agentTotal);
        writer.printf("\"الإجمالي\",\"%d\",\"%d+\",\"--\"%n",
                clientTotal + agentTotal, clientPrinted);
    }

    private void generatePeriodReportCsv(PrintWriter writer, ExportRequest request) {
        writer.println("تقرير الفترات");
        writer.println("الفرع,التاريخ من,التاريخ إلى");
        writer.println(getBranchName(request.getBranchId()) + "," +
                request.getStartDate() + "," +
                request.getEndDate());
        writer.println();

        writer.println("اليوم,التاريخ,المواعيد المتاحة,المواعيد المحجوزة,إجمالي المواعيد");
        writer.println("الأحد,2025-09-25,10,9,19");
        writer.println("الإثنين,2025-09-26,8,5,13");
    }

    private void generateTicketsAttendanceCsv(PrintWriter writer, ExportRequest request) {
        LocalDate startDate = LocalDate.parse(request.getStartDate());
        LocalDate endDate = LocalDate.parse(request.getEndDate());

        writer.println("تقرير التذاكر والحضور");
        writer.println("الفرع: " + getBranchName(request.getBranchId()));
        writer.println("من تاريخ: " + request.getStartDate());
        writer.println("إلى تاريخ: " + request.getEndDate());
        writer.println();

        Map<String, Object> filters = request.getFilters();

        // Get queue logs for ticket data
        List<QueueLog> queueLogs = queueLogRepository.findBySiteAndDateRange(
                request.getBranchId(), startDate, endDate);

        // Add summary section
        writer.println("ملخص التذاكر");
        writer.println("المؤشر,القيمة");

        // Calculate totals from queue logs
        Integer totalPrintedTickets = queueLogRepository.getTotalPrintedTickets(
                request.getBranchId(), startDate, endDate);

        if (totalPrintedTickets == null)
            totalPrintedTickets = 0;

        // Get appointment counts for comparison
        long totalAppointments = appointmentRepository.countBySiteAndDateRange(
                request.getBranchId(), startDate, endDate);
        long totalAgentAppointments = clearingAgentRepository.countBySiteAndDateRange(
                request.getBranchId(), startDate, endDate);
        long allAppointments = totalAppointments + totalAgentAppointments;

        writer.printf("\"إجمالي المواعيد المحجوزة\",\"%d\"%n", allAppointments);
        writer.printf("\"التذاكر المطبوعة\",\"%d\"%n", totalPrintedTickets);
        writer.printf("\"معدل الحضور\",\"%.1f%%\"%n",
                allAppointments > 0 ? (totalPrintedTickets * 100.0 / allAppointments) : 0.0);
        writer.println();

        // Daily breakdown
        writer.println("التوزيع اليومي للتذاكر");
        writer.println("التاريخ,عدد التذاكر المطبوعة,اسم الطابور");

        queueLogs.forEach(log -> {
            writer.printf("\"%s\",\"%d\",\"%s\"%n",
                    log.getAppointmentDate(),
                    log.getPrintedTickets(),
                    escapeCSV(log.getQueueId().getQueueNameArab()));
        });
        writer.println();

        // Queue summary
        writer.println("ملخص الطوابير");
        writer.println("اسم الطابور,إجمالي التذاكر المطبوعة");

        queueLogs.stream()
                .collect(java.util.stream.Collectors.groupingBy(
                        log -> log.getQueueId().getQueueNameArab(),
                        java.util.stream.Collectors.summingInt(QueueLog::getPrintedTickets)))
                .forEach((queueName, total) -> {
                    writer.printf("\"%s\",\"%d\"%n", escapeCSV(queueName), total);
                });

        // Apply additional filters if provided
        String selectedReportId = filters != null ? (String) filters.get("selectedReportId") : null;
        if (selectedReportId != null && !selectedReportId.isEmpty()) {
            writer.println();
            writer.printf("تم تطبيق فلتر التقرير: %s%n", selectedReportId);
        }
    }

    private void generateOverallAnalysisCsv(PrintWriter writer, ExportRequest request) {
        writer.println("التقارير الإحصائية");
        writer.println("الفرع,التاريخ من,التاريخ إلى");
        writer.println(getBranchName(request.getBranchId()) + "," +
                request.getStartDate() + "," +
                request.getEndDate());
        writer.println();

        writer.println("المؤشر,مدينة عيسى,المحرق");
        writer.println("عدد المواعيد,130,95");
        writer.println("عدد المواعيد المحجوزة,50,35");
    }

    private void generateDefaultCsv(PrintWriter writer, ExportRequest request) {
        writer.println("تقرير عام");
        writer.println("الفرع,التاريخ من,التاريخ إلى");
        writer.println(getBranchName(request.getBranchId()) + "," +
                request.getStartDate() + "," +
                request.getEndDate());
        writer.println();
        writer.println("لا توجد بيانات متاحة للتصدير");
    }

    private String getBranchName(Integer branchId) {
        return switch (branchId.intValue()) {
            case 1 -> "Isa Town";
            case 2 -> "Muharraq";
            case 3 -> "Salman Prot";
            case 4 -> "Isa Town CPR Issue";
            case 5 -> "Isa Town CPR Renewal";
            default -> "Unknown Branch";
        };
    }

    public String getFileName(ExportRequest request) {
        String branchName = getBranchName(request.getBranchId()).replace(" ", "-");
        String tabType = getArabicTabName(request.getTabType());
        String timestamp = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));

        return String.format("%s-%s-%s.csv", tabType, branchName, timestamp);
    }

    private String getArabicTabName(String tabType) {
        return switch (tabType) {
//            case "viewAll" -> "نظرة-عامة";
//            case "Appointments" -> "المواعيد";
//            case "viewPeriodReport" -> "تقرير-الفترات";
//            case "viewTicketsAttendance" -> "التذاكر-والحضور";
//            case "viewOverallAnalysis" -> "التقارير-الإحصائية";
//            default -> "تقرير";
            case "viewAll" -> "Overview";
            case "Appointments" -> "Appointments";
            case "viewPeriodReport" -> "Period-Report";
            case "viewTicketsAttendance" -> "Tickets-Attendance";
            case "viewOverallAnalysis" -> "Overall-Analysis";
            default -> "Report";
        };
    }

    /**
     * Escapes CSV values to handle quotes, commas, and Arabic text
     */
    private String escapeCSV(String value) {
        if (value == null || value.isEmpty()) {
            return "";
        }

        // Replace double quotes with escaped quotes and handle commas
        String escaped = value.replace("\"", "\"\"");

        // Replace regular commas with Arabic comma to avoid CSV parsing issues
        escaped = escaped.replace(",", "،");

        return escaped;
    }

    /**
     * Enhanced branch name lookup with database fallback
     */
    private String getBranchNameEnhanced(Integer branchId) {
        // Try to get from database first
        Optional<SiteInfo> siteOpt = siteInfoRepository.findBySiteId(branchId);
        if (siteOpt.isPresent()) {
            return siteOpt.get().getSiteDescArb();
        }

        // Fallback to hardcoded names
        return getBranchName(branchId);
    }
}
