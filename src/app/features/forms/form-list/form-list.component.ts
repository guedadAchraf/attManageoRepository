import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormService, Form } from '../../../core/services/form.service';
import { ExcelService } from '../../../core/services/excel.service';

@Component({
  selector: 'app-form-list',
  templateUrl: './form-list.component.html',
  styleUrls: ['./form-list.component.scss']
})
export class FormListComponent implements OnInit {
  forms: Form[] = [];
  loading = true;
  displayedColumns: string[] = ['name', 'fields', 'submissions', 'createdAt', 'actions'];

  constructor(
    private formService: FormService,
    private excelService: ExcelService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadForms();
  }

  loadForms(): void {
    this.loading = true;
    this.formService.getForms().subscribe({
      next: (forms) => {
        this.forms = forms;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.snackBar.open('Erreur lors du chargement', 'Fermer', { duration: 3000 });
      }
    });
  }

  deleteForm(form: Form): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer "${form.name}"?`)) {
      this.formService.deleteForm(form.id).subscribe({
        next: () => {
          this.snackBar.open('Formulaire supprimé', 'Fermer', { duration: 3000 });
          this.loadForms();
        },
        error: () => {
          this.snackBar.open('Erreur lors de la suppression', 'Fermer', { duration: 3000 });
        }
      });
    }
  }

  editForm(form: Form): void {
    this.router.navigate(['/forms', form.id, 'edit']);
  }

  submitForm(form: Form): void {
    this.router.navigate(['/forms', form.id, 'submit']);
  }

  createForm(): void {
    this.router.navigate(['/forms/create']);
  }

  downloadExcel(form: Form): void {
    this.excelService.getLatestExcelForForm(form.id).subscribe({
      next: (excelFile) => {
        if (excelFile) {
          this.excelService.downloadExcel(excelFile.id);
          this.snackBar.open('Téléchargement en cours...', 'Fermer', { duration: 2000 });
        } else {
          this.snackBar.open('Aucun fichier Excel disponible pour ce formulaire', 'Fermer', { duration: 3000 });
        }
      },
      error: () => {
        this.snackBar.open('Erreur lors de la récupération du fichier', 'Fermer', { duration: 3000 });
      }
    });
  }
}
