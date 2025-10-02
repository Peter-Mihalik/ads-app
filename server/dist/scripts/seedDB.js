import testData from "./testData.json" with { type: 'json' };
/* Typescript generic function that finds most recent timedEntry (adress, idenfier, name)
 * Initialy first entry is most recent. Compare it to other and set new most recent when
 * (mRecent.validFrom < tEntry.validFrom)
 * I am able to directly comapare strings because of YYYY-MM-DD date format
 * */
function mRecTimeEnt(timedEntries) {
    let mRecent = {
        i: 0,
        validFrom: timedEntries[0].validFrom
    };
    timedEntries.forEach((timedEntry, index) => {
        if (timedEntry.validFrom > mRecent.validFrom) {
            mRecent.i = index;
            mRecent.validFrom = timedEntry.validFrom;
        }
    });
    return timedEntries[mRecent.i];
}
/* This function trasnforms raw data obtained from json into
 * usable form
*/
function transformData(raw) {
    /* There are historic entries for names, adresses and identifiers
     * I have to use the most recent one
    */
    const rawNames = raw.fullNames;
    /* If there is only one entry that's the most recent one
     * Dont have to call mRecTimeEnt() at all (reduced overhead)
    */
    const recName = rawNames.length == 1 ? rawNames[0].value : mRecTimeEnt(rawNames).value;
    const rawIdenfs = raw.identifiers;
    const recIdenf = rawIdenfs.length == 1 ? rawIdenfs[0].value : mRecTimeEnt(rawIdenfs).value;
    const rawAdrs = raw.addresses;
    const recAdress = rawAdrs.length == 1 ? rawAdrs[0] : mRecTimeEnt(rawAdrs);
    // adress.formatedAddress is used in too few cases
    const adress = `${recAdress.municipality.value}, ${recAdress?.street ?? ""} ${recAdress?.buildingNumber ?? recAdress.regNumber}`;
    const trasformedData = {
        name: recName,
        adress: adress,
        ico: recIdenf,
    };
    if (adress.includes("Dubová"))
        console.log(trasformedData);
    return trasformedData;
}
async function getData(url) {
    let data = null;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status:  ${response.status}`);
        }
        data = await response.json();
    }
    catch (error) {
        console.error(error.message);
    }
    return data;
}
//const result = await getData("https://api.statistics.sk/rpo/v1/search?addressMunicipality=bardejov&establishmentAfter=2016-01-01&establishmentBefore=2016-12-31");
//if (result) {
const result = testData;
result.results.forEach((company) => {
    transformData(company);
});
//}
