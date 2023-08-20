import { expect } from "@playwright/test"
import { paymentDetails } from "../data/paymentDetails"

export class PaymentPage {
    constructor(page) {
        this.page = page;

        this.discountCode = page.frameLocator('[data-qa="active-discount-container"]');
            .locator('[data-qa="discount-code"]');
        this.discountInput = page.locator('[data-qa="discount-code-input"]');
        this.submitDiscountButton = page.locator('[data-qa="submit-discount-button"]');
        this.discountActivatedMessage = page.locator('[data-qa="discount-active-message"]');
        this.totalValue = page.locator('[data-qa="total-value"]');
        this.totalWithDiscountValue = page.locator('[data-qa="total-with-discount-value"]');
        this.creditCardOwnerInput = page.locator('[data-qa="credit-card-owner"]');
        this.creditCardNumberInput = page.locator('[data-qa="credit-card-number"]');
        this.creditCardValidUntilInput = page.locator('[data-qa="valid-until"]');
        this.creditCardCVCInput = page.locator('[data-qa="credit-card-cvc"]');
        this.continueButtonPay = page.locator('[data-qa="pay-button"]');

    }

    activateDiscount = async () => {
        await this.discountCode.waitFor();
        const code = await this.discountCode.innerText();
        //option 1 for laggy inputs: using .fill() with await expect
        //need to fill out the discount input
        await this.discountInput.fill(code);
        //wait to see that the input contains the value which was entered
        await expect(this.discountInput).toHaveValue(code);
    
        //option 2 for laggy inputs: using slow typing
        //await this.discountInput.focus()
        //await this.page.keyboard.type(code, {delay: 1000})
        //expect(await this.discountInput.inputValue()).toBe(code)

        expect(await this.totalWithDiscountValue.isVisible()).toBe(false);
        expect(await this.discountActivatedMessage.isVisible()).toBe(false);

        await this.submitDiscountButton.waitFor();
        await this.submitDiscountButton.click();
        
        await this.discountActivatedMessage.waitFor();
        await expect(this.discountActivatedMessage).toHaveText('Discount activated!');

        const totalPrice = await this.totalValue.innerText();
        const totalPriceWithoutDollarSign = totalPrice.replace("$", "");
        const totalPriceNumber = parseInt(totalPriceWithoutDollarSign, 10);

        const discountPrice = await this.totalWithDiscountValue.innerText();
        const discountPriceWithoutDollarSign = discountPrice.replace("$", "");
        const discountPriceNumber = parseInt(discountPriceWithoutDollarSign, 10);

        expect(discountPriceNumber).toBeLessThan(totalPriceNumber);
        //await this.page.pause()
    }

    fillPaymentDetails = async(paymentDetails) => {
        await this.creditCardOwnerInput.waitFor();
        await this.creditCardOwnerInput.fill(paymentDetails.creditCardOwner);
        await this.creditCardNumberInput.waitFor();
        await this.creditCardNumberInput.fill(paymentDetails.creditCardNumber);
        await this.creditCardValidUntilInput.waitFor();
        await this.creditCardValidUntilInput.fill(paymentDetails.creditCardValidUntil);
        await this.creditCardCVCInput.waitFor();
        await this.creditCardCVCInput.fill(paymentDetails.creditCardCVC);
    }

    completePayment = async () => {
        await this.continueButtonPay.waitFor();
        await this.continueButtonPay.click();
        await this.page.waitForURL(/\/thank-you/, { timeout: 3000 });
    }   
}