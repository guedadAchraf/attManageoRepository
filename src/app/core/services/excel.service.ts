import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ExcelFile {
  id: number;
  fileName: string;
  filePath: string;
  ownerId: number;
  formId: number;
  version: number;
  submissionsCount: number;
  createdAt: Date;
  form?: {
    id: number;
    name: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ExcelService {
  constructor(private http: HttpClient) {}

  getExcelFiles(): Observable<ExcelFile[]> {
    return this.http.get<ExcelFile[]>(`${environment.apiUrl}/excel`);
  }

  getLatestExcelForForm(formId: number): Observable<ExcelFile | null> {
    return this.http.get<ExcelFile | null>(`${environment.apiUrl}/excel/form/${formId}/latest`);
  }

  downloadExcel(id: number): void {
    const url = `${environment.apiUrl}/excel/${id}/download`;
    const token = localStorage.getItem('token');
    
    fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => response.blob())
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `export_${id}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    });
  }

  deleteExcel(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/excel/${id}`);
  }
}
