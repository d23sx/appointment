import { Component, EventEmitter, Input, Output } from '@angular/core';
import { data } from '../../../../app/data';
import { WeeklyGraphs } from '../../../../shared/components/weekly-graphs/weekly-graphs';
import { BranchStatus } from '../../../overall-dashboard-body/components/branch-status/branch-status';
import { SectionName } from '../../../../shared/components/section-name/section-name';
import { IconConstant } from '../../../../shared/constants/icon-constants/icon-constant';
import { CustomButton } from '../../../../shared/components/custom-button/custom-button';
import { CardsContainer } from '../../../../shared/components/cards-container/cards-container';
import { TicketCard } from '../../../../shared/components/ticket-card/ticket-card';
@Component({
  selector: 'app-overveiw',
  imports: [
    WeeklyGraphs,
    BranchStatus,
    SectionName,
    CustomButton,
    CardsContainer,
    TicketCard,
  ],
  templateUrl: './overveiw.html',
  styleUrl: './overveiw.css',
})
export class Overveiw {
  @Output() veiwTicket = new EventEmitter();
  @Input() tickets = data.analysisTicketCard
  list = data.analysisCard;
  listTicket = data.analysisTicketCard;

  branchesStatus = data.BRANCH_STATUS;
  branchs = IconConstant.BRANCH_MANAGEMENT;

  veiwTick() {
    this.veiwTicket.emit();
  }
}
