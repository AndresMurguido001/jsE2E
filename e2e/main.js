const puppeteer = require('puppeteer');
const faker = require('faker');
const fs = require('fs');
const mkdirp = require('mkdirp');
const inquirer = require('inquirer');
// completeForm for passportCenter / passportRenewal;
const { passportRenewalForm } = require("./passportRenewal");

(async () => {
    let whichSite = {
        type: 'list',
        name: 'site',
        message: 'Please select a website from the list below to initiate test: ',
        choices: [
            "https://departsmart.dev.govworks.com/checkout/step-1",
            'https://checkout.dev.govworks.com/checkout/step-1',
            'https://www.fedex.rushmypassport.com/checkout/step-1',
            'https://dev.passportrenewal.com/checkout/step1',
            'https://dev.passportcenter.com/checkout/step1'
        ]
    };
    let whichPassport = {
        type: 'list',
        name: 'passport',
        message: 'Select one of the following passport types: ',
        choices: [
            'Passport Renewal',
            'New Passport',
            'Child Passport',
            'Lost Passport',
            'Damaged Passport',
            'Name Change',
            'Stolen Passport',
            'Second Passport'
        ]
    };
    let whichService = {
        type: 'list',
        name: 'service',
        message: 'Select one of the following services: ',
        choices: [
            'Same Day Service',
            'Next Day Service',
            'Priority Service',
            'Rush Service',
            'Standard Service',
        ]
    };
    let answers1 = await inquirer.prompt([whichSite, whichPassport])
    if (answers1.passport === "Passport Renewal") {
        whichService.choices.push("Smart Service");
    }
    let answers2 = await inquirer.prompt(whichService);
    await completeForm(answers1.site, answers1.passport, answers2.service);
})();

async function completeForm(webSite, passport, service){ 
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto(webSite);
    let firstname = faker.name.findName();
    let lastname = faker.name.findName();

    //Date information for email
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let i = Math.floor(Math.random()*100);
    let email = `andres.murguido+${mm}${dd}${i}@govworks.com`;

    // Which passport was selected?
    let passportOption;
    switch (passport) {
        case "Passport Renewal":
            passportOption = 1;
            break;
        case "New Passport":
            passportOption = 2;
            break;
        case "Child Passport":
            passportOption = 3;
            break;
        case "Lost Passport":
            passportOption = 4;
            break;
        case "Damaged Passport":
            passportOption = 5;
            break;
        case "Name Change":
            passportOption = 6;
            break;
        case "Second Passport":
            passportOption = 7;
            break;
        case "Stolen Passport":
            passportOption = 8;
            break;
    }

    let serviceOption;
    switch (service) {
        case "Same Day Service":
            serviceOption = 1;
            break;
        case "Next Day Service":
            serviceOption = 2;
            break;
        case "Priority Service":
            serviceOption = 3;
            break;
        case "Rush Service":
            serviceOption = 4;
            break;
        case "Standard Service":
            serviceOption = 5;
            break;
        case "Smart Service":
            serviceOption = 6;
            break;
    }
    // This determines which parent list to select the passport option from, bc there are 2 ul's containing options.
    let listNumber;
    if (webSite === 'https://dev.passportrenewal.com/checkout/step1'|| 
        webSite === 'https://dev.passportcenter.com/checkout/step1') {
        if (passportOption <= 4) {
            listNumber = 1;
        } else {
            listNumber = 2;
        }
    }
    // SELECTORS
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

        if (webSite === "https://dev.passportrenewal.com/checkout/step1" ||
            webSite === "https://dev.passportcenter.com/checkout/step1") {
            // Passport Center / Passport Renewal;
            // Passport renewal / center must evaluate their own service;
            await passportRenewalForm(page, passportOption, service, listNumber);
            
        } else {
            //steps 1 - 3;
            firstnameInput = "input[name='first']";
            lastnameInput = "input[name='last']";
            dateInput = "input[name='dob']";
            emailInput = "input[type='email']";
            phoneNumber = "input[ng-reflect-name='mobile']";
            passportSelector = "#mat-select-0";
            passportSelectChild = `#mat-option-${passportOption}`
            serviceSelector = `mat-radio-group > mat-radio-button:nth-child(${serviceOption}) > label`;
            addressSelector = "input[formcontrolname='address_line']";
            // Depart smart shipping radio button is nested within a section
            shippingSelector = webSite === "https://departsmart.dev.govworks.com/checkout/step-1" ? "mat-radio-group > section >mat-radio-button" :
 "mat-radio-group > mat-radio-button",
            submitBtn =  "button.gw-chkout-button.gw-chkout-summary__cta-button";
            //step - 4
            creditCardNumberSelector = "#cc-number";
            creditCardNameSelector = "input[formcontrolname='cc_name']";
            creditCardMonth = 'mat-select[formcontrolname="cc_exp_month"]'
            creditCardMonthOption = "mat-option:nth-child(1)";
            creditCardYear = "#mat-select-2";
            creditCardYearOption = "mat-form-field:nth-child(3)";
            creditCardCCV = "#cc-cvc";
            agreeToTermsSelector = "#mat-checkbox-1";

            // START FILLING OUT FORM
            // Applicant Info
            await page.waitFor(firstnameInput);
            await page.waitFor(500);
            await page.type(firstnameInput, firstname);
            await page.waitFor(500);
            await page.type(lastnameInput, lastname);
            await page.waitFor(500);
            await page.type(dateInput, passportOption === 3 ? `09/09/2010` : `09/09/1989`);
            
            // Passport Application - Select dropdown
            await page.click(passportSelector);

            // Passport select option
            await page.click(passportSelectChild);

            // Click Expediting service option. Not working with just 'page.click'; 
            //let selector = `mat-radio-group > mat-radio-button:nth-child(${serviceOption}) > label`;
            await page.evaluate((serviceSelector) => document.querySelector(serviceSelector).click(), serviceSelector); 

            // Passport insurance
            await page.click(submitBtn);


            // Step 2
            // Customer Info
            await page.waitFor(emailInput);
            await page.type(emailInput, email);
            await page.waitFor(500);
            await page.type(phoneNumber, faker.phone.phoneNumber());

            await page.click(submitBtn);
            
            // Wait for 1 second and check if error dialog is visible after submitting;
            // THIS SHOULD BE SEPERATED INTO ITS OWN CATCH ERROR FUNCTION
            await page.waitFor(1000);
            if (await page.$("#mat-dialog-3") !== null) {
                await page.click("div.cdk-overlay-container");
                console.log("ERROR WITH EMAIL: Should generate new email and try again");
            }

            //Step-3 - address input
            await page.waitFor(addressSelector);

            await page.focus(addressSelector);
            await page.keyboard.type("78 sw 7th", { delay: 100 });
            await page.keyboard.press('ArrowDown');
            await page.keyboard.press('Enter');
            await page.waitFor(1000);
            await page.click(shippingSelector);

            
            await page.click(submitBtn);



            // Step-4 Credit card info
            await page.waitFor(creditCardNumberSelector);
            await page.focus(creditCardNumberSelector);
            await page.keyboard.type("4242424242424242", { delay: 100 });
            await page.type(creditCardNameSelector, faker.name.findName());
            await page.click(creditCardMonth);
            await page.waitFor(100);
            await page.click(creditCardMonthOption);
            await page.click(creditCardYear);
            await page.waitFor(300);
            await page.click(creditCardYearOption);
            await page.type(creditCardCCV, "1234");
           
            await page.click(agreeToTermsSelector);

            await page.click(submitBtn);
            await page.waitFor("div.gw-chkout-confirmation__cta");
    }
    // wait for step-5
    await browser.close();

    // If test was successful, write information to file;
    let websiteFolder;
    switch(webSite){
        case 'https://checkout.dev.govworks.com/checkout/step-1':
            websiteFolder = "Fastport";
            break;
         
        case 'https://www.fedex.rushmypassport.com/checkout/step-1':
            websiteFolder = "Fedex";
            break;

        case 'https://dev.passportrenewal.com/checkout/step1':
            websiteFolder = "PassportRenewal";
            break;
        case "https://departsmart.dev.govworks.com/checkout/step-1":
            websiteFolder = "DepartSmart";
            break;

        case 'https://dev.passportcenter.com/checkout/step1':
            websiteFolder = "PassportCenter";
            break;
    }

    //write firstname, lastname, email to file for records;
    let filepath = `${__dirname}/Records/${websiteFolder}/${mm}${dd}/`;
    fs.exists(filepath, (exists) => {
        if(exists) {
                    fs.appendFile(`${filepath}/records.txt`, `${firstname}, ${lastname}, ${email}\n`, (err) => {
                        if(err) {
                            return console.log("ERROR: ", err);
                        };
                        console.log("The file was updated and saved");
                    });
        } else {
            mkdirp(filepath, (err) => {
                    fs.writeFile(`${filepath}/records.txt`, `${firstname}, ${lastname}, ${email}\n`, {flag: 'w' }, (err) => {
                        if(err) {
                            return console.log("ERROR: ", err);
                        };
                        console.log("The file was updated and saved");
                    });

                });


        }
    });
};

async function autoScroll(page){
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if(totalHeight >= scrollHeight){
                    clearInterval(timer);
                    resolve();
                }
            }, 200);
        });
    });
}
