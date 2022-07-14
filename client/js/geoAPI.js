
/*
    API CALLS
*/

// let getGeoHintsByCountry = `https://geofactsapi.herokuapp.com/countries/${country}/`
let getCountries= `https://geofactsapi.herokuapp.com/countries/`

/* retrieves a set amount of hints based on difficulty or random and returns the to be displayed */


/*
    RETURNS ALL HINTS FOR A GIVEN COUNTRY
*/
const getGeoFacts = async (country) => {

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
const getAllCountries = async () => {

    await fetch(

        getCountries,
    {
            headers: { // this made us not get an empty object
                "Content-Type": "application/json"
            },
            method: 'GET'
        }
    ).then(

        resp => resp.json()

    ).then(

        (data) => { setCountries(data) }

    ).catch(

        (e) => { console.log(e) }
    )

}

getAllCountries();

