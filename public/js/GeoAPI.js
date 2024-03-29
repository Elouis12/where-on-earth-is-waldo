export class GeoAPI{

/*
    API CALLS
*/

// let getGeoHintsByCountry = `https://geofactsapi.herokuapp.com/countries/facts${country}/`
    getCountries = `https://geofactsapi.herokuapp.com/countries/`


/*
    RETURNS ALL HINTS FOR A GIVEN COUNTRY
*/
    getGeoFacts = async (country, count, difficulty) => {

        let facts = [];
        await fetch(

            /*${this.getCountries}*/'https://geofactsapi.onrender.com/countries/facts' + `/${country}/${count}`,
            {
                headers: { // this made us not get an empty object
                    "Content-Type": "application/json"
                },
                method: 'GET'
            }
        ).then(
            resp  => resp.json()
        ).then(
            data => {

                // grab only the facts
                for( let x = 0; x < data.length; x+=1 ){

                    facts.push( data[x].fact );
                }

            }
        ).catch(
            (e) => { console.log(e) }
        )

        return facts;

    }


/*
    RETURNS ALL COUNTRIES IN TH DB
*/
    getAllCountries = async () => {

        let countries = [];
        await fetch(

            /*this.getCountries*/ 'https://geofactsapi.onrender.com/countries',
            {
                headers: { // this made us not get an empty object
                    "Content-Type": "application/json"
                },
                method: 'GET'
            }
        ).then(

            resp => resp.json()

        ).then(

            (data) => { countries = data; /*console.log(data)*/ }

        ).catch(

            (e) => { console.log(e) }
        )

        return countries;

    }


}
