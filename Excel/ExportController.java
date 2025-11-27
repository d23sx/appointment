package com.iga.mawaeed.service.Excel;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/export")
@CrossOrigin(origins = "http://localhost:4200") // Allow requests from Angular dev server
public class ExportController {

    private final CsvExportService csvExportService;

    public ExportController(CsvExportService csvExportService) {
        this.csvExportService = csvExportService;
    }

    @PostMapping("/csv")
    public ResponseEntity<byte[]> exportToCsv(@Valid @RequestBody ExportRequest request) {
        try {
            // Generate CSV content
            String csvContent = csvExportService.generateCsv(request);

            // Convert string to bytes with UTF-8 encoding
            byte[] csvBytes = csvContent.getBytes(StandardCharsets.UTF_8);

            // Generate filename
            String fileName = csvExportService.getFileName(request);

            // Set headers for file download
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType("text/csv; charset=UTF-8"));
            headers.setContentDispositionFormData("attachment", fileName);
            headers.setContentLength(csvBytes.length);

            return new ResponseEntity<>(csvBytes, headers, HttpStatus.OK);

        } catch (Exception e) {
            // Log the error (you should use a proper logger)
            System.err.println("Error generating CSV: " + e.getMessage());
            e.printStackTrace();

            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Export service is running!");
    }
}
