import { LightningElement } from 'lwc';
import getLatestRates from '@salesforce/apex/TradesController.getLatestRates';
import { createRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ExchangeNewTrade extends LightningElement {

    sellCurrency='';
    sellAmount;
    buyCurrency='';
    buyAmount;
    rate = 0;

    isLoading = false;

    handleChange(event) {
        if(event.target.fieldName == 'Sell_Currency__c') {
            this.sellCurrency = event.detail.value;
            this.updateRate();
        } else if(event.target.fieldName == 'Buy_Currency__c') {
            this.buyCurrency = event.detail.value;
            this.updateRate();
        } else if(event.target.fieldName == 'Sell_Amount__c') {
            this.sellAmount = event.detail.value;
            this.buyAmount = this.sellAmount * this.rate;
        } 
    }

    // Check if both needed fields have values before you update the rate for the currencies
    updateRate() {
        if(this.sellCurrency != '' && this.buyCurrency != '') {
            this.isLoading = true;
            let currencies = this.sellCurrency + ',' + this.buyCurrency;
            getLatestRates({currencies : currencies})
            .then((data) => {
                const latestRates = JSON.parse(data);
                // Set the value of Sell Currency to the base currency in the API. Payment is needed for manually setting the base currency in fixer.io
                this.sellCurrency = latestRates.base;
                this.rate = latestRates.rates[this.buyCurrency];
                this.buyAmount = this.sellAmount * this.rate;
                this.isLoading = false;
            })
            .catch(error => {
                this.showToast('Error', error.body.message, 'error');
            })
        }
    }

    changeView() {
        const changeViewEvent = new CustomEvent('changeview');
        this.dispatchEvent(changeViewEvent);
    }
    
    saveTrade(){
        this.isLoading = true;
        var fields = {'Sell_Currency__c' : this.sellCurrency, 
                        'Sell_Amount__c' : this.sellAmount, 
                        'Buy_Currency__c' : this.buyCurrency,
                        'Buy_Amount__c' : this.buyAmount,
                        'Rate__c' : this.rate,
                        'Date_Booked__c' : new Date()};
        
        var objRecordInput = {'apiName' : 'Trade__c', fields};
        createRecord(objRecordInput).then(() => {
            this.showToast('New Trade', 'Trade saved', 'success');
            this.isLoading = false;
        }).catch(error => {
            let fieldErrors = error.body.output.fieldErrors;
            let errorMessage;
            //Check if the error is from missing values in the required fields
            if(error.body.output.fieldErrors) {
                for( let fieldName in fieldErrors) {
                    errorMessage = error.body.output.fieldErrors[fieldName][0].message.toString().replaceAll('__c', '').replaceAll('_', ' ');
                    break;
                }
            } else
                errorMessage = error.body.message;

            this.showToast('Error', errorMessage, 'error');
        });
    }

    showToast(title, message, variant) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(evt);
    }
}