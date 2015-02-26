/**
 * Created by Niels on 11/02/2015.
 */

var api = (function(){
    var organizations,
        countries,
        keywords,
        categories;
    this.getOrganizations=function(cback){
        if(organizations) {
            cback(organizations);
        }else{
            $.getJSON('/api/yfu_organizations',function(data){
                organizations=data;
                cback(data);
            })
        }
    };
    this.getCountries=function(cback){
        if(countries) {
            cback(countries);
        }else{
            $.getJSON('/api/countries',function(data){
                countries=data;
                cback(data);
            })
        }
    };
    this.getKeywords=function(cback){
        if(keywords) {
            cback(keywords);
        }else{
            $.getJSON('/api/keywords?is_predefined=true',function(data){
                keywords=data;
                cback(data);
            })
        }
    };
    this.getCategories=function(cback){
        if(categories) {
            cback(categories);
        }else{
            $.getJSON('/api/categories',function(data){
                categories=data;
                cback(data);
            })
        }
    };
    return this;
})();