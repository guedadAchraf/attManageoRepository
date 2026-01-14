import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormService, Form } from '../../../core/services/form.service';

@Component({
  selector: 'app-form-edit',
  templateUrl: './form-edit.component.html',
  styleUrls: ['./form-edit.component.scss']
})
export class FormEditComponent implements OnInit {
  formBuilderForm!: FormGroup;
  loading = false;
  formId!: number;

  constructor(
    private fb: FormBuilder,
    private formService: FormService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.formId = parseInt(this.route.snapshot.params['id']);
    
    this.formBuilderForm = this.fb.group({
      name: ['', Validators.required],
      fields: this.fb.array([])
    });

    this.loadForm();
  }

  loadForm(): void {
    this.loading = true;
    this.formService.getForm(this.formId).subscribe({
      next: (form) => {
        this.formBuilderForm.patchValue({ name: form.name });
        
        form.fields.forEach(field => {
          const fieldGroup = this.fb.group({
            type: [field.type, Validators.required],
            label: [field.label, Validators.required],
            required: [field.required],
            order: [field.order]
          });
          this.fields.push(fieldGroup);
        });
        
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Erreur lors du chargement', 'Fermer', { duration: 3000 });
        this.router.navigate(['/forms']);
      }
    });
  }

  get fields(): FormArray {
    return this.formBuilderForm.get('fields') as FormArray;
  }

  addField(): void {
    const fieldGroup = this.fb.group({
      type: ['text', Validators.required],
      label: ['', Validators.required],
      required: [false],
      order: [this.fields.length]
    });
    
    this.fields.push(fieldGroup);
  }

  removeField(index: number): void {
    this.fields.removeAt(index);
    this.updateFieldOrders();
  }

  moveFieldUp(index: number): void {
    if (index > 0) {
      const field = this.fields.at(index);
      this.fields.removeAt(index);
      this.fields.insert(index - 1, field);
      this.updateFieldOrders();
    }
  }

  moveFieldDown(index: number): void {
    if (index < this.fields.length - 1) {
      const field = this.fields.at(index);
      this.fields.removeAt(index);
      this.fields.insert(index + 1, field);
      this.updateFieldOrders();
    }
  }

  updateFieldOrders(): void {
    this.fields.controls.forEach((control, index) => {
      control.patchValue({ order: index });
    });
  }

  onSubmit(): void {
    if (this.formBuilderForm.invalid) {
      this.snackBar.open('Veuillez remplir tous les champs requis', 'Fermer', { duration: 3000 });
      return;
    }

    this.loading = true;
    const { name, fields } = this.formBuilderForm.value;

    this.formService.updateForm(this.formId, name, fields).subscribe({
      next: () => {
        this.snackBar.open('Formulaire modifié avec succès!', 'Fermer', { duration: 3000 });
        this.router.navigate(['/forms']);
      },
      error: (error) => {
        this.loading = false;
        const message = error.error?.error || 'Erreur lors de la modification';
        this.snackBar.open(message, 'Fermer', { duration: 5000 });
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/forms']);
  }
}
