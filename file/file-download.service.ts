import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileDownloadService {

  /**
   * Download a blob as a file
   * @param blob - The blob data
   * @param filename - Name for the downloaded file
   */
  downloadBlob(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;

    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the URL object
    window.URL.revokeObjectURL(url);
  }

  /**
   * Generate filename with timestamp
   * @param prefix - File prefix
   * @param extension - File extension (default: csv)
   * @returns Generated filename
   */
  generateFilename(prefix: string, extension: string = 'csv'): string {
    const now = new Date();
    const timestamp = now.toISOString().slice(0, 19).replace(/[T:]/g, '-');
    return `${prefix}-${timestamp}.${extension}`;
  }

  /**
   * Get Arabic-friendly filename for reports
   * @param reportType - Type of report
   * @param branchName - Branch name
   * @returns Safe ASCII filename (HTTP headers only support ASCII)
   */
  getArabicFilename(reportType: string, branchName: string): string {
    // Use English names for HTTP compatibility (Arabic not supported in Content-Disposition header)
    const reportNames: { [key: string]: string } = {
      'viewAll': 'overview',
      'Appointments': 'appointments',
      'viewPeriodReport': 'periods-report',
      'viewTicketsAttendance': 'tickets-attendance',
      'viewOverallAnalysis': 'statistical-reports'
    };

    const reportName = reportNames[reportType] || 'report';

    // Transliterate Arabic branch names to English/safe characters
    const cleanBranchName = this.transliterateArabic(branchName);

    return this.generateFilename(`${reportName}-${cleanBranchName}`);
  }

  /**
   * Transliterate Arabic text to ASCII-safe characters
   * @param text - Arabic text to transliterate
   * @returns ASCII-safe text
   */
  private transliterateArabic(text: string): string {
    // Trim any whitespace that might be causing issues
    const cleanText = text.trim();
    
    // Common Bahraini branch names transliteration map
    const transliterationMap: { [key: string]: string } = {
      'مدينة عيسى': 'Isa-Town',
      'المحرق': 'Muharraq',
      'ميناء سلمان': 'Salman-Port',
      'مدينة عيسى - اصدار بطاقة هوية': 'Isa-Town-ID-Issuance',
      'مدينة عيسى - تجديد بطاقة الهوية': 'Isa-Town-ID-Renewal',
      'المنامة': 'Manama',
      'الرفاع': 'Riffa',
      'سترة': 'Sitra',
      'الحد': 'Hadd',
      'مدينة حمد': 'Hamad-Town',
      'جدحفص': 'Jidhafs',
      'البديع': 'Budaiya',
      'عالي': 'Aali'
    };

    console.log('Original text:', `"${text}"`);
    console.log('Cleaned text:', `"${cleanText}"`);
    console.log('Text length:', cleanText.length);

    // Check if exact match exists
    if (transliterationMap[cleanText]) {
      console.log('✓ Exact match found:', transliterationMap[cleanText]);
      return transliterationMap[cleanText];
    }

    // Debug: Show all keys and compare
    console.log('⚠ No exact match found. Available keys:');
    Object.keys(transliterationMap).forEach(key => {
      const matches = key === cleanText;
      console.log(`  "${key}" === "${cleanText}": ${matches}`);
      if (key.includes('مدينة') || cleanText.includes('مدينة')) {
        // Show character-by-character comparison for similar entries
        console.log(`    Key length: ${key.length}, Text length: ${cleanText.length}`);
      }
    });

    // Otherwise, remove spaces and non-ASCII characters
    const filename = cleanText.replace(/\s+/g, '-')
                         .replace(/[^\w-]/g, '') // Remove non-ASCII characters
                         .replace(/^-+|-+$/g, '') // Trim dashes
                         || 'branch';
    
    console.log('⚠ Using fallback transliteration:', filename);
    return filename;
  }
}
