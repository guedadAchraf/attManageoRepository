import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface FormField {
  id?: number;
  type: 'text' | 'textarea';
  label: string;
  order: number;
  required: boolean;
}

export interface Form {
  id: number;
  name: string;
  creatorId: number;
  createdAt: Date;
  updatedAt: Date;
  fields: FormField[];
  _count?: {
    submissions: number;
  };
}

export interface FormSubmission {
  id: number;
  formId: number;
  submitterId: number;
  data: Record<string, string>;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class FormService {
  constructor(private http: HttpClient) {}

  getForms(): Observable<Form[]> {
    return this.http.get<Form[]>(`${environment.apiUrl}/forms`);
  }

  getForm(id: number): Observable<Form> {
    return this.http.get<Form>(`${environment.apiUrl}/forms/${id}`);
  }

  createForm(name: string, fields: FormField[]): Observable<Form> {
    return this.http.post<Form>(`${environment.apiUrl}/forms`, { name, fields });
  }

  updateForm(id: number, name: string, fields: FormField[]): Observable<Form> {
    return this.http.put<Form>(`${environment.apiUrl}/forms/${id}`, { name, fields });
  }

  deleteForm(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/forms/${id}`);
  }

  submitForm(formId: number, data: Record<string, string>): Observable<any> {
    return this.http.post(`${environment.apiUrl}/forms/${formId}/submit`, { data });
  }

  generateExcel(formId: number, submissionIds?: number[]): Observable<any> {
    return this.http.post(`${environment.apiUrl}/forms/${formId}/generate-excel`, { submissionIds });
  }

  getSubmissions(formId: number): Observable<FormSubmission[]> {
    return this.http.get<FormSubmission[]>(`${environment.apiUrl}/forms/${formId}/submissions`);
  }
}
