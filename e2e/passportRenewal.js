const faker = require('faker');

module.exports = {
    passportRenewalForm: async (page, passportOption, service, listNumber) => {
        
        let firstname = faker.name.findName();
        let lastname = faker.name.findName();

        

        //Date information for email
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        let i = Math.floor(Math.random()*100);
        let email = `andres.murguido+${mm}${dd}${i}@govworks.com`;

        //Service Option number
        let serviceOption;
        switch (service) {
            case "Same Day Service":
                serviceOption = 6;
                break;
            case "Next Day Service":
                serviceOption = 5;
                break;
            case "Priority Service":
                serviceOption = 4;
                break;
            case "Rush Service":
                serviceOption = 3;
                break;
            case "Standard Service":
                serviceOption = 2;
                break;
            case "Smart Service":
                serviceOption = 1;
                break;
        }

        // Selectors
        let firstnameInput, 
            lastnameInput, 
            dateInput, 
            emailInput, 
            phoneNumber,
            passportSelector, 
            passportSelectChild, 
            serviceSelector,
            shippingSelector,
            addressSelector,
            citySelector,
            stateSelector,
            zipCodeSelector,
            creditCardNumberSelector,
            creditCardNameSelector,
            creditCardMonth,
            creditCardMonthOption,
            creditCardYear,
            creditCardYearOption,
            creditCardCCV;


        firstnameInput = "#input_0";
        lastnameInput = "#input_1";
        dateInput = "#input_2";
        emailInput = "#input_3";
        phoneNumber = "#input_4";
        passportSelector = "gw-passport-type-drop > div > button";
        passportSelectChild = `ul.gw-passport-types:nth-of-type(${listNumber}) > li:nth-of-type(${passportOption}) > button`;
        // If option is passportRenewal, "Smart Service" gets added to list of expediting options
        serviceSelector = `md-radio-button:nth-of-type(${passportOption === 0 ? serviceOption : serviceOption - 1})`;
        shippingSelector = `md-radio-group > md-radio-button:nth-of-type(3)`; // Add option for shipping.
        addressSelector = "#input_0";
        citySelector = "#input_2";
        stateSelector = "md-select[name='state']";
        stateSelectorOption = "#select_option_16";
        //stateSelectorOption = "md-select-menu > md-content > md-option:nth-of-type(1)";
        //stateSelector = "select_option_16";
        //stateSelectorOption = "md-select-menu > md-content > md-option:nth-of-type(1)";
        zipCodeSelector = "#input_3";
        //submitBtn = "#passport-processing-form > div.layout-align-center-center.layout-column > button";
        submitBtn = "button.gw-button.gw-button--continue";
        // step - 4;
        creditCardNumberSelector = "#input_3";
        creditCardNameSelector = "#input_2";
        creditCardMonth = "#select_4";
        creditCardMonthOption = "#select_option_11";
        creditCardYear = "#select_6";
        creditCardYearOption = "#select_option_23"
        creditCardCCV = "#input_8";
        agreeToTermsSelector = "md-checkbox > .md-container";
        submitPayment = "button.gw-checkout-submit.gw-checkout-submit--finish";
        // End Selectors

        // Step 1;
        await page.waitFor(passportSelector);
        await page.click(passportSelector);
        await page.waitFor(500);
        await page.click(passportSelectChild);
        await page.type(firstnameInput, firstname);
        await page.type(lastnameInput, lastname);
        await page.focus(dateInput);
        // Child passport requires a date before 2004;
        if (passportOption === 3) {
            await page.keyboard.type(`09092010`, { delay: 300 });   
        } else {
            await page.keyboard.type(`09091989`, { delay: 300 });   
        }
        // Passport Application - Select dropdown
        //await page.click(passportSelector);

        
        
        await page.evaluate((serviceSelector) => document.querySelector(serviceSelector).click(), serviceSelector); 
        console.log("PASSPORT OPTION: ", passportOption);
        console.log("SERVICE OPTION: ", serviceOption);
        // Click Expediting service option. Not working with just 'page.click'; 
       if (passportOption === 1 && (serviceOption === 2 || serviceOption === 3)) { 
           // Answer additional questions for Smart service and Standard Service;
            await page.waitFor("button.gw-passport-wizard-btn");
           // click "Yes"
            await page.click("button.gw-passport-wizard-btn");
            await page.waitFor(500)
           // click "Yes"
            await page.click("button.gw-passport-wizard-btn");
            await page.waitFor(500)
           // click "Yes"
            await page.click("button.gw-passport-wizard-btn");
            await page.waitFor(500)
           // click "Yes"
            await page.click("button.gw-passport-wizard-btn");
            await page.waitFor(500)
           // click "No"
            await page.click("div:nth-of-type(2) > button.gw-passport-wizard-btn");
            await page.waitFor(500)
            // click "Yes"
            await page.click("button.gw-passport-wizard-btn");
            await page.waitFor(500)
           // click "No"
            await page.click("div:nth-of-type(2) > button.gw-passport-wizard-btn");
       }

        await page.click(submitBtn);

        // Step 2;
        await page.waitForNavigation();
        await page.waitFor(firstnameInput);
        await page.type(firstnameInput, firstname);
        await page.type(lastnameInput, lastname);
        await page.type(emailInput, email);
        await page.type(phoneNumber, faker.phone.phoneNumber());
 
        await page.click(submitBtn);


        //Step-3 - address input
        await page.waitFor(addressSelector);

        await page.waitFor(shippingSelector);
        await page.click(shippingSelector);
        await page.waitFor(500);
        await page.type(addressSelector, "78 sw 7th st");
        await page.waitFor(500);
        await page.type(citySelector, "Miami");
        await page.waitFor(500);
        await page.click(stateSelector);
        await page.waitFor(500);
        await page.click(stateSelectorOption);
        await page.waitFor(500);
        await page.type(zipCodeSelector, "33130");

        await page.click(submitBtn);

        // Step-4 Credit card info
        await page.waitFor("gw-form-credit-card");
        await page.waitFor(500);
        await page.click(creditCardNumberSelector);
        await page.waitFor(500);
        await page.keyboard.type("4242424242424242", { delay: 100 });
        await page.waitFor(500);
        await page.click(creditCardMonth);
        await page.waitFor(100);
        await page.click(creditCardMonthOption);
        await page.waitFor(500);
        await page.click(creditCardYear);
        await page.waitFor(300);
        await page.click(creditCardYearOption);
        await page.waitFor(500);
        await page.type(creditCardCCV, "1234");
       
        await page.waitFor(500);
        await page.click(agreeToTermsSelector);

        //Submit card
        await page.waitFor(500);
        await page.click(submitPayment);
        await page.waitFor("ol.gw-confirmation-steps.js-confirmation-steps");



 
    }
};
