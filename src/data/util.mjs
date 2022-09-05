const getTitleCaseFromSpaced = (str) => {
    let titleCase = str.replaceAll(/ ([a-zA-Z])/g, (match, p1 ) => " " + p1.toUpperCase());
    titleCase = titleCase.replace(/^(.)/, (match, p1 ) => p1.toUpperCase());
    return titleCase;
    

    // let titleCase = str.replace(/(^[a-zA-Z])(.*)/, "$1".toUpperCase() + "$2");
    // return titleCase;
}

export { getTitleCaseFromSpaced };