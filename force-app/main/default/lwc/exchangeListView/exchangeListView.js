import { LightningElement, track, wire} from 'lwc';
import getTrades from '@salesforce/apex/TradesController.getTrades';
import {refreshApex} from '@salesforce/apex';

const columns = [
    { label: 'ID', fieldName: 'Name', type: 'text', hideDefaultActions : true },
    { label: 'Sell Currency', fieldName: 'Sell_Currency__c', type: 'text', hideDefaultActions : true},
    { label: 'Sell Amount', fieldName: 'Sell_Amount__c', type: 'number', hideDefaultActions : true, cellAttributes: { alignment: 'left' }},
    { label: 'Buy Currency', fieldName: 'Buy_Currency__c', type: 'text', hideDefaultActions : true},
    { label: 'Buy Amount', fieldName: 'Buy_Amount__c', type: 'number', hideDefaultActions : true, cellAttributes: { alignment: 'left' }},
    { label: 'Rate', fieldName: 'Rate__c', type: 'number', hideDefaultActions : true, cellAttributes: { alignment: 'left' }},
    { label: 'Date Booked', fieldName: 'Date_Booked__c', type: 'date', hideDefaultActions : true, typeAttributes: {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false 
        }
    }
];

export default class ExchangeListView extends LightningElement {
    @track trades=[];
    error;
    columns = columns;
    rowLimit = 25;
    rowOffSet = 0;

    isLoading = false;

    //Variable for wired controller method. Needed for refreshApex to work for the datatable to be responsive to new trades created in the 'New Trade' view
    wiredService;

    @wire(getTrades, { limitSize: 25 , offset : 0 })
    wiredAccount(value) {
        this.isLoading = true;
        this.wiredService = value;
        const { data, error } = value;
        if (data) {
            this.trades = data;
            this.error = undefined;
            this.isLoading = false;
        } else if (error) {
            this.error = error;
            this.trades = undefined;
        }
    }

    connectedCallback() {
        refreshApex(this.wiredService);
    }

    loadData(){
        return  getTrades({ limitSize: this.rowLimit , offset : this.rowOffSet })
        .then(result => {
            let updatedRecords = [...this.trades, ...result];
            this.trades = updatedRecords;
            this.error = undefined;
        })
        .catch(error => {
            console.log(error);
            this.error = error;
            this.trades = undefined;
        });
    }

    loadMoreData(event) {
        const currentRecord = this.trades;
        const { target } = event;
        target.isLoading = true;
        this.rowOffSet = this.rowOffSet + this.rowLimit;
        this.loadData()
            .then(()=> {
                // Stop looking for more records if already brought all
                if(currentRecord.length == this.trades.length) {
                    target.enableInfiniteLoading = false;
                }
                target.isLoading = false;
            });   
    }

    changeView() {
        const changeViewEvent = new CustomEvent('changeview');
        this.dispatchEvent(changeViewEvent);
    }
}