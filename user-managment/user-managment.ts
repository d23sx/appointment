import { Component } from '@angular/core';
import { EmployeesTable } from './components/employees-table/employees-table';
import { SectionName } from '../../shared/components/section-name/section-name';
import { CardsContainer } from '../../shared/components/cards-container/cards-container';
import { data } from '../../app/data';


@Component({
  selector: 'app-user-managment',
  imports: [SectionName, CardsContainer, EmployeesTable],
  templateUrl: './user-managment.html',
  styleUrl: './user-managment.css',
})
export class UserManagment {
  list = data.cardItems;
}
