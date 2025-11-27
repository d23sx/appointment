import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ExportRequest {
  branchId: number;
  startDate: string;
  endDate: string;
  tabType: string;
  filters?: {
    searchTerm?: string;
    status?: string;
    reportType?: string;
    selectedBranch?: string;
    [key: string]: any;
  };
  pagination?: {
    page: number;
    size: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = 'http://localhost:8080/api/v1'; // Adjust to your backend URL

  constructor(private http: HttpClient) {}

  /**
   * Export data as CSV
   * @param exportRequest - The export parameters
   * @returns Observable<Blob> - CSV file as blob
   */
  exportToCsv(exportRequest: ExportRequest): Observable<Blob> {
    const headers = new HttpHeaders({
      'Accept': 'text/csv',
      'Content-Type': 'application/json'
    });

    return this.http.post(`${this.baseUrl}/export/csv`, exportRequest, {
      headers: headers,
      responseType: 'blob'
    });
  }

  /**
   * Get appointments data for a specific branch and date range
   * @param branchId - Branch identifier
   * @param startDate - Start date
   * @param endDate - End date
   * @returns Observable with appointments data
   */
  getAppointments(branchId: number, startDate: string, endDate: string): Observable<any[]> {
    const params = new HttpParams()
      .set('branchId', branchId.toString())
      .set('startDate', startDate)
      .set('endDate', endDate);

    return this.http.get<any[]>(`${this.baseUrl}/appointments`, { params });
  }

  /**
   * Get analysis data for reports
   * @param branchId - Branch identifier
   * @param startDate - Start date
   * @param endDate - End date
   * @param tabType - Type of analysis (overview, periods, etc.)
   * @returns Observable with analysis data
   */
  getAnalysisData(branchId: number, startDate: string, endDate: string, tabType: string): Observable<any> {
    const params = new HttpParams()
      .set('branchId', branchId.toString())
      .set('startDate', startDate)
      .set('endDate', endDate)
      .set('tabType', tabType);

    return this.http.get<any>(`${this.baseUrl}/analysis`, { params });
  }
}
