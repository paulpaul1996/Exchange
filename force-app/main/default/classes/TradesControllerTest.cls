@IsTest
public with sharing class TradesControllerTest {
    @TestSetup 
    static void setup() {
        List<Trade__c> trades = new List<Trade__c>();
        for(Integer i = 0; i < 200; i++) {
            trades.add(new Trade__c(Buy_Currency__c='USD', Buy_Amount__c=100, Sell_Currency__c='EUR', Sell_Amount__c=89, Rate__c = 1.09, Date_Booked__c = Datetime.now()));
        }
        insert trades;
    }

    @IsTest
    static void getLatestRates() {
        String currencies = 'GBP,EUR,USD';
        Test.startTest();
        Test.setMock(HttpCalloutMock.class, new ApiMockResponse());
        String result = TradesController.getLatestRates(currencies);
        Test.stopTest();

        Boolean isSuccess = false;
        JSONParser parser = JSON.createParser(result);
        while (parser.nextToken() != null) {
            if ((parser.getCurrentToken() == JSONToken.FIELD_NAME) && 
                (parser.getText() == 'success')) {
                parser.nextToken();
                isSuccess = parser.getBooleanValue();
                break;
            }
        }
        System.assertEquals(isSuccess, true);
    }    

    @IsTest
    static void getTrades25() {
        List<Trade__c> trades = new List<Trade__c>();

        Test.startTest();
        trades = TradesController.getTrades(25, 0);
        Test.stopTest();

        System.assertEquals(trades.size(), 25);
    }  

    @IsTest
    static void getTrades125() {
        List<Trade__c> trades = new List<Trade__c>();

        Test.startTest();
        trades = TradesController.getTrades(125, 75);
        Test.stopTest();

        System.assertEquals(trades.size(), 125);
    }  

    @IsTest
    static void getTradesToManyRequested() {
        List<Trade__c> trades = new List<Trade__c>();

        Test.startTest();
        trades = TradesController.getTrades(225, 0);
        Test.stopTest();

        System.assertEquals(trades.size(), 200);
        System.assertNotEquals(trades.size(), 225);
    }  
}
