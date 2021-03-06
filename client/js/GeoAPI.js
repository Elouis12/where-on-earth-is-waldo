export class GeoAPI{

/*
    API CALLS
*/

// let getGeoHintsByCountry = `https://geofactsapi.herokuapp.com/countries/${country}/`
    getCountries = `https://geofactsapi.herokuapp.com/countries/`


/*
    RETURNS ALL HINTS FOR A GIVEN COUNTRY
*/
    getGeoFacts = async (country) => {

        let facts = {};
        await fetch(

            `https://geofactsapi.herokuapp.com/countries/${country}/`,
            {
                headers: { // this made us not get an empty object
                    "Content-Type": "application/json"
                },
                method: 'GET'
            }
        ).then(
            resp  => resp.json()
        ).then(
            data => { facts = data;}
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

            this.getCountries,
            {
                headers: { // this made us not get an empty object
                    "Content-Type": "application/json"
                },
                method: 'GET'
            }
        ).then(

            resp => resp.json()

        ).then(

            (data) => { countries = data; }

        ).catch(

            (e) => { console.log(e) }
        )

        return countries;

    }


}
