import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormService, Form } from '../../../core/services/form.service';
import { ExcelService } from '../../../core/services/excel.service';

@Component({
  selector: 'app-submission-success-dialog',
  template: `
    <h2 mat-dialog-title>✅ Données enregistrées avec succès!</h2>
    <mat-dialog-content>
      <p style="font-size: 16px; margin: 20px 0;">
        Que souhaitez-vous faire maintenant?
      </p>
      <div style="display: flex; flex-direction: column; gap: 10px;">
        <mat-card style="cursor: pointer; padding: 16px;" (click)="onGenerateExcel()">
          <div style="display: flex; align-items: center; gap: 12px;">
            <mat-icon color="primary" style="font-size: 32px; width: 32px; height: 32px;">download</mat-icon>
            <div>
              <h3 style="margin: 0;">Générer et télécharger Excel</h3>
              <p style="margin: 4px 0 0 0; color: #666; font-size: 14px;">
                Télécharger un fichier Excel avec toutes les données
              </p>
            </div>
          </div>
        </mat-card>
        
        <mat-card style="cursor: pointer; padding: 16px;" (click)="onContinue()">
          <div style="display: flex; align-items: center; gap: 12px;">
            <mat-icon color="accent" style="font-size: 32px; width: 32px; height: 32px;">add_circle</mat-icon>
            <div>
              <h3 style="margin: 0;">Continuer à ajouter des données</h3>
              <p style="margin: 4px 0 0 0; color: #666; font-size: 14px;">
                Remplir le formulaire à nouveau
              </p>
            </div>
          </div>
        </mat-card>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Fermer</button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-card {
      transition: all 0.2s;
    }
    mat-card:hover {
      background-color: #f5f5f5;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    mat-dialog-content {
      min-width: 400px;
    }
  `]
})
export class SubmissionSuccessDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<SubmissionSuccessDialogComponent>
  ) {}

  onGenerateExcel(): void {
    this.dialogRef.close('generate');
  }

  onContinue(): void {
    this.dialogRef.close('continue');
  }
}

@Component({
  selector: 'app-form-submit',
  templateUrl: './form-submit.component.html',
  styleUrls: ['./form-submit.component.scss']
})
export class FormSubmitComponent implements OnInit {
  form: Form | null = null;
  submissionForm!: FormGroup;
  loading = false;
  formId!: number;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private formService: FormService,
    private excelService: ExcelService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.formId = parseInt(this.route.snapshot.params['id']);
    this.loadForm();
  }

  loadForm(): void {
    this.loading = true;
    this.formService.getForm(this.formId).subscribe({
      next: (form) => {
        this.form = form;
        this.buildSubmissionForm();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Erreur lors du chargement', 'Fermer', { duration: 3000 });
        this.router.navigate(['/forms']);
      }
    });
  }

  buildSubmissionForm(): void {
    if (!this.form) return;
    
    const group: any = {};
    
    this.form.fields.forEach(field => {
      const validators = field.required ? [Validators.required] : [];
      group[field.id!.toString()] = ['', validators];
    });
    
    this.submissionForm = this.fb.group(group);
  }

  onSubmit(): void {
    if (this.submissionForm.invalid) {
      this.snackBar.open('Veuillez remplir tous les champs requis', 'Fermer', { duration: 3000 });
      return;
    }

    this.submitting = true;
    const data = this.submissionForm.value;

    this.formService.submitForm(this.formId, data).subscribe({
      next: (response) => {
        this.submitting = false;
        
        // Open dialog instead of alert
        const dialogRef = this.dialog.open(SubmissionSuccessDialogComponent, {
          width: '500px',
          disableClose: false
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result === 'generate') {
            this.generateAndDownloadExcel();
          } else if (result === 'continue') {
            this.submissionForm.reset();
          }
        });
      },
      error: (error) => {
        this.submitting = false;
        const message = error.error?.error || 'Erreur lors de la soumission';
        this.snackBar.open(message, 'Fermer', { duration: 5000 });
      }
    });
  }

  generateAndDownloadExcel(): void {
    // Generate Excel with ALL submissions (no submissionIds = all data)
    this.formService.generateExcel(this.formId).subscribe({
      next: (response) => {
        this.snackBar.open('Fichier Excel généré avec toutes les données!', 'Fermer', { duration: 3000 });
        
        // Get the latest Excel file and download it
        this.excelService.getLatestExcelForForm(this.formId).subscribe({
          next: (excelFile) => {
            if (excelFile) {
              this.excelService.downloadExcel(excelFile.id);
              this.snackBar.open('Téléchargement en cours...', 'Fermer', { duration: 2000 });
            }
            this.submissionForm.reset();
            this.submitting = false;
          },
          error: () => {
            this.submitting = false;
            this.snackBar.open('Erreur lors du téléchargement', 'Fermer', { duration: 3000 });
          }
        });
      },
      error: (error) => {
        this.submitting = false;
        const message = error.error?.error || 'Erreur lors de la génération Excel';
        this.snackBar.open(message, 'Fermer', { duration: 5000 });
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/forms']);
  }
}
