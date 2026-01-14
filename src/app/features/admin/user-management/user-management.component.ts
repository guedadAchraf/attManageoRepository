import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService, User } from '../../../core/services/user.service';

interface EditUserDialogData {
  user: User;
}

@Component({
  selector: 'app-edit-user-dialog',
  template: `
    <h2 mat-dialog-title>Modifier l'utilisateur</h2>
    <mat-dialog-content>
      <form [formGroup]="editForm">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Email</mat-label>
          <input matInput type="email" formControlName="email">
          <mat-error *ngIf="editForm.get('email')?.hasError('required')">
            L'email est requis
          </mat-error>
          <mat-error *ngIf="editForm.get('email')?.hasError('email')">
            Email invalide
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nouveau mot de passe (optionnel)</mat-label>
          <input matInput type="password" formControlName="password">
          <mat-hint>Laissez vide pour ne pas changer</mat-hint>
          <mat-error *ngIf="editForm.get('password')?.hasError('minlength')">
            Minimum 6 caractères
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Rôle</mat-label>
          <mat-select formControlName="role">
            <mat-option value="USER">Utilisateur</mat-option>
            <mat-option value="ADMIN">Administrateur</mat-option>
          </mat-select>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Annuler</button>
      <button mat-raised-button color="primary" (click)="save()" [disabled]="editForm.invalid || saving">
        <mat-spinner *ngIf="saving" diameter="20"></mat-spinner>
        {{ saving ? 'Enregistrement...' : 'Enregistrer' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
    mat-dialog-content {
      min-width: 400px;
    }
  `]
})
export class EditUserDialogComponent {
  editForm: FormGroup;
  saving = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditUserDialogComponent>,
    private userService: UserService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: EditUserDialogData
  ) {
    this.editForm = this.fb.group({
      email: [data.user.email, [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6)]],
      role: [data.user.role, Validators.required]
    });
  }

  save(): void {
    if (this.editForm.invalid) return;

    this.saving = true;
    const formValue = this.editForm.value;
    const updateData: any = {
      email: formValue.email,
      role: formValue.role
    };

    // Only include password if it was changed
    if (formValue.password) {
      updateData.password = formValue.password;
    }

    this.userService.updateUser(this.data.user.id, updateData).subscribe({
      next: () => {
        this.snackBar.open('Utilisateur modifié avec succès!', 'Fermer', { duration: 3000 });
        this.dialogRef.close(true);
      },
      error: (error) => {
        this.saving = false;
        const message = error.error?.error || 'Erreur lors de la modification';
        this.snackBar.open(message, 'Fermer', { duration: 5000 });
      }
    });
  }
}

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  loading = true;
  displayedColumns: string[] = ['email', 'role', 'formsCount', 'submissionsCount', 'createdAt', 'actions'];
  showCreateForm = false;
  createUserForm!: FormGroup;
  submitting = false;

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.createUserForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['USER', Validators.required]
    });

    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Erreur lors du chargement', 'Fermer', { duration: 3000 });
      }
    });
  }

  toggleCreateForm(): void {
    this.showCreateForm = !this.showCreateForm;
    if (!this.showCreateForm) {
      this.createUserForm.reset({ role: 'USER' });
    }
  }

  createUser(): void {
    if (this.createUserForm.invalid) {
      this.snackBar.open('Veuillez remplir tous les champs', 'Fermer', { duration: 3000 });
      return;
    }

    this.submitting = true;
    const { email, password, role } = this.createUserForm.value;

    this.userService.createUser(email, password, role).subscribe({
      next: () => {
        this.snackBar.open('Utilisateur créé avec succès!', 'Fermer', { duration: 3000 });
        this.createUserForm.reset({ role: 'USER' });
        this.showCreateForm = false;
        this.submitting = false;
        this.loadUsers();
      },
      error: (error) => {
        this.submitting = false;
        const message = error.error?.error || 'Erreur lors de la création';
        this.snackBar.open(message, 'Fermer', { duration: 5000 });
      }
    });
  }

  deleteUser(user: User): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur "${user.email}"?`)) {
      this.userService.deleteUser(user.id).subscribe({
        next: () => {
          this.snackBar.open('Utilisateur supprimé', 'Fermer', { duration: 3000 });
          this.loadUsers();
        },
        error: (error) => {
          const message = error.error?.error || 'Erreur lors de la suppression';
          this.snackBar.open(message, 'Fermer', { duration: 3000 });
        }
      });
    }
  }

  changeRole(user: User): void {
    const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
    
    if (confirm(`Changer le rôle de "${user.email}" en ${newRole}?`)) {
      this.userService.updateUser(user.id, { role: newRole }).subscribe({
        next: () => {
          this.snackBar.open('Rôle modifié avec succès!', 'Fermer', { duration: 3000 });
          this.loadUsers();
        },
        error: () => {
          this.snackBar.open('Erreur lors de la modification', 'Fermer', { duration: 3000 });
        }
      });
    }
  }

  editUser(user: User): void {
    const dialogRef = this.dialog.open(EditUserDialogComponent, {
      width: '500px',
      data: { user }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUsers();
      }
    });
  }
}
