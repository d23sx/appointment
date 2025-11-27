/* tslint:disable:no-unused-variable */
import {  ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TicketsAndAttendance } from './ticketsAndAttendance';

describe('TicketsAndAttendance', () => {
  let component: TicketsAndAttendance;
  let fixture: ComponentFixture<TicketsAndAttendance>;

  beforeEach(async(() => {
    await TestBed.configureTestingModule({
      declarations: [ TicketsAndAttendance ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketsAndAttendance);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
