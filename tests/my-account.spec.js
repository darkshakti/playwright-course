import { test } from "@playwright/test"
import { MyAccountPage } from "../page-objects/MyAccountPage";

test.only("My Account using cookie injection", async ({ page }) => {
    // Make a request to get login token
    // Inject the login token into the browser
    const myAccount = new MyAccountPage(page);
    await myAccount.visit();
})