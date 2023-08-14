import { expect } from "@playwright/test"
import { Navigation } from "./Navigation"
import { isDesktopViewport } from "../utils/isDesktopViewport"

export class ProductsPage {
    constructor(page) {
        this.page = page
        this.addButtons = page.locator('[data-qa="product-button"]')
        this.sortDropdown = page.locator('[data-qa="sort-dropdown"]')
        this.producteTitle = page.locator('[data-qa="product-title"]')

    }

    visit = async () => {
        await this.page.goto("/")
    }

    addProductToBasket = async (index) => {
        const specificAddButton = this.addButtons.nth(index)
        await specificAddButton.waitFor()
        await expect(specificAddButton).toHaveText("Add to Basket");
        const navigation = new Navigation(this.page)
        //only desktop viewport
        let basketCountBeforeAdding //undefined
        if (isDesktopViewport(this.page)) {
            basketCountBeforeAdding = await navigation.getBasketCount()
        }
        await specificAddButton.click()
        await expect(specificAddButton).toHaveText("Remove from Basket")
        //only desktop viewport
        if (isDesktopViewport(this.page)) {
            const basketCountAfterAdding = await navigation.getBasketCount()
            expect(basketCountAfterAdding).toBeGreaterThan(basketCountBeforeAdding)
        }
    }

    sortByCheapest = async () => {
        await this.sortDropdown.waitFor()
        await this.producteTitle.first().waitFor()
        // get order of products
        const producteTitlesBeforeSorting = await this.producteTitle.allInnerTexts()
        await this.sortDropdown.selectOption("price-asc")
        // get order of products
        const producteTitlesAfterSorting = await this.producteTitle.allInnerTexts()
        // expect that these lists are different
        expect(producteTitlesAfterSorting).not.toEqual(producteTitlesBeforeSorting)
    }
}