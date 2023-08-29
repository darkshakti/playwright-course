import { test } from "@playwright/test"
import { MyAccountPage } from "../page-objects/MyAccountPage";
import { getLoginToken } from "../api-calls/getLoginToken";

test.only("My Account using cookie injection", async ({ page }) => {
    // Make a request to get login token
    const loginToken = await getLoginToken();
    console.warn({loginToken});

    // Inject the login token into the browser
    const myAccount = new MyAccountPage(page);
    await myAccount.visit();
    await page.evaluate(([loginTokenInsideBrowserCode]) => {
        document.cookie = "token=" + loginTokenInsideBrowserCode;
    }, [loginToken]);
    await myAccount.visit();
    await myAccount.waitForPageHeading();
})