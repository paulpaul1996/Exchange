public with sharing class TradesController {

    @AuraEnabled
    public static String getLatestRates(String currencies){
        try {
            HttpRequest req = new HttpRequest();
            ApiAccessKey__c accessToken = ApiAccessKey__c.getOrgDefaults();
            String endpoint = 'callout:LatestRates/api/latest?access_key=' + accessToken.Value__c + '&symbols=' + currencies;
            req.setEndpoint(endpoint);
            req.setMethod('GET');
            Http http = new Http();
            HTTPResponse res = http.send(req);
            return res.getBody();
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Trade__c> getTrades(Integer limitSize, Integer offset){
        List<Trade__c> tradeList = [SELECT Name, Sell_Currency__c, Sell_Amount__c, Buy_Currency__c, Buy_Amount__c, Rate__c, Date_Booked__c
                                     FROM Trade__c
                                     ORDER BY Date_Booked__c DESC
                                     LIMIT :limitSize
                                     OFFSET :offset
                                     ];
        return tradeList;
    }
}
