import { Page, Locator, expect } from '@playwright/test';

export default class TeamPaymentsPage {
    readonly page: Page;
    selectors: { [key: string]: Locator | any };

    constructor(page: Page) {
        this.page = page;
        this.selectors = {
            createPaymentsHeading: page.getByRole('heading', { name: 'Create payments' }),
            payForHoursTab: page.getByRole('link', { name: 'Pay for hours' }),
            approvedTimesheetsTab: page.getByRole('link', { name: 'Approved timesheets' }),
            oneTimeAmountTab: page.getByRole('link', { name: 'One-time amount' }),
            oneTimeAmountHeading: page.getByRole('heading', { name: 'Send payments' }),
            membersField: page.getByRole('textbox', { name: 'Select members' }),
            addedmemberByName: (memberName: string) => page.getByRole('listitem', { name: `${memberName}` }),
            amountPerMemberField: page.getByRole('spinbutton', { name: 'Amount per member*' }),
            noteField: page.getByRole('textbox', { name: 'Enter a note about the payment' }),
            notesInfoText: page.getByText('Notes are visible to members.'),
            memberSelection: (memberName: string) => page.getByRole('treeitem', { name: memberName }),
            createPaymentButton: page.getByRole('link', { name: 'Create payment' }),
            paymentSummary: page.locator('.form-horizontal'),
            paymentModalHeader: page.locator('.modal-dialog').getByText('Payment', { exact: true }),
            createPaymentWizard: page.locator('#wizard').getByText('Create payment'),
            sendExportPaymentWizard: page.getByText('Send/Export payment', { exact: true }),
            modalBody: page.locator('.modal-body').last(),
            notNowButton: page.locator('#export_payment').getByText('Not now'),
            closeModalButton: page.locator('.modal-dialog .close').last(),
            createPaymentModalButton: page.locator('.modal-dialog input[name="commit"]'),
            deletePaymentButton: (note: string) => page.locator(`:has-text("${note}")`).getByRole('link', { name: 'Delete' }),
            cellByText: (text: string) => page.getByRole('cell', { name: `${text}` }),
            markedAsPaidMessage: page.getByText('Marked as paid', { exact: true }),
            noteDeletedMessage: page.getByText('Note deleted', { exact: true }),
        };

    }

    async navigateToTeamPaymentsByOrg(organizationId: string) {
        await this.page.goto(`/organizations/${organizationId}/team_payments`);
        await expect(this.page).toHaveURL(new RegExp(`/organizations/${organizationId}/team_payments`));
    }

    async openOneTimeAmountTab() {
        await this.selectors.oneTimeAmountTab.click();
        await expect(this.selectors.oneTimeAmountHeading).toBeVisible();
        await expect(this.page).toHaveURL(/bonus/);
    }

    async selectMemberByName(memberName: string) {
        await this.selectors.membersField.click();
        const memberLocator = this.selectors.memberSelection(memberName);
        await expect(memberLocator).toBeVisible();
        await memberLocator.click();
        await expect(this.selectors.addedmemberByName(memberName)).toBeVisible();
    }

    async enterAmountPerMember(amount: string) {
        await this.selectors.amountPerMemberField.fill(amount);
        await expect(this.selectors.amountPerMemberField).toHaveValue(amount);
    }

    async enterNote(note: string) {
        await this.selectors.noteField.fill(note);
        await expect(this.selectors.noteField).toHaveValue(note);
    }

    async clickCreatePaymentButton() {
        await this.selectors.createPaymentButton.click();
        await expect(this.selectors.paymentModalHeader).toBeVisible();
        await expect(this.selectors.createPaymentWizard).toBeVisible();
    }

    async verifyPaymentSummary() {
        await this.verifyModalBody('first');
    }

    async verifyModalBody(modal: 'first' | 'second') {
        const modalBody = this.selectors.modalBody;
        if (modal === 'first') {
            await expect(modalBody).toHaveScreenshot('first-payment-modal-body.png');
        } else if (modal === 'second') {
            await expect(modalBody).toHaveScreenshot('second-payment-modal-body.png');
        }
    }

    async clickCreatePaymentModalButton() {
        await this.selectors.createPaymentModalButton.click();
        await expect(this.selectors.markedAsPaidMessage).toBeVisible();
        await expect(this.selectors.sendExportPaymentWizard).toBeVisible();
        await this.verifyModalBody('second');
    }

    async clickNotNowButton() {
        await this.selectors.notNowButton.click();
    }

    async deleteCreatedPaymentByNote(note: string) {
        const deleteButton = this.selectors.deletePaymentButton(note);
        await expect(deleteButton).toBeVisible();
        await deleteButton.click();

        await expect(this.selectors.noteDeletedMessage).toBeVisible();
        expect(this.selectors.cellByText(note)).not.toBeVisible();
    }
}
