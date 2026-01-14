import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ExcelService, ExcelFile } from '../../../core/services/excel.service';

@Component({
  selector: 'app-excel-list',
  templateUrl: './excel-list.component.html',
  styleUrls: ['./excel-list.component.scss']
})
export class ExcelListComponent implements OnInit {
  excelFiles: ExcelFile[] = [];
  loading = true;
  displayedColumns: string[] = ['fileName', 'formName', 'version', 'submissionsCount', 'createdAt', 'actions'];

  constructor(
    private excelService: ExcelService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadExcelFiles();
  }

  loadExcelFiles(): void {
    this.loading = true;
    this.excelService.getExcelFiles().subscribe({
      next: (files) => {
        this.excelFiles = files;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Erreur lors du chargement', 'Fermer', { duration: 3000 });
      }
    });
  }

  downloadFile(file: ExcelFile): void {
    this.snackBar.open('Téléchargement en cours...', 'Fermer', { duration: 2000 });
    this.excelService.downloadExcel(file.id);
  }

  deleteFile(file: ExcelFile): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer "${file.fileName}"?`)) {
      this.excelService.deleteExcel(file.id).subscribe({
        next: () => {
          this.snackBar.open('Fichier supprimé', 'Fermer', { duration: 3000 });
          this.loadExcelFiles();
        },
        error: () => {
          this.snackBar.open('Erreur lors de la suppression', 'Fermer', { duration: 3000 });
        }
      });
    }
  }
}
