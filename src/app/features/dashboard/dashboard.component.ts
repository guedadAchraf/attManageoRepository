import { Component, OnInit } from '@angular/core';
import { FormService } from '../../core/services/form.service';
import { ExcelService } from '../../core/services/excel.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  stats = {
    formsCount: 0,
    excelFilesCount: 0,
    totalSubmissions: 0
  };
  loading = true;
  currentUser: any;

  constructor(
    private formService: FormService,
    private excelService: ExcelService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadStats();
  }

  loadStats(): void {
    this.loading = true;

    this.formService.getForms().subscribe({
      next: (forms) => {
        this.stats.formsCount = forms.length;
        this.stats.totalSubmissions = forms.reduce((sum, form) => 
          sum + (form._count?.submissions || 0), 0
        );
        
        this.excelService.getExcelFiles().subscribe({
          next: (files) => {
            this.stats.excelFilesCount = files.length;
            this.loading = false;
          },
          error: () => this.loading = false
        });
      },
      error: () => this.loading = false
    });
  }
}
