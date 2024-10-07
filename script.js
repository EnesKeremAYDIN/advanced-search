function selectSuggestedSite() {
    const selectedSite = document.getElementById('siteSuggestions').value;
    document.getElementById('siteName').value = selectedSite;
}

document.querySelectorAll('input[name="fileType"]').forEach((input) => {
    input.addEventListener('change', function () {
        if (this.value === 'custom') {
            document.getElementById('customFileTypeInput').style.display = 'flex';
        } else {
            document.getElementById('customFileTypeInput').style.display = 'none';
        }
    });
});

function performSearch() {
    var keywords = document.getElementById('searchKeywords').value;
    var site = document.getElementById('siteName').value;
    var searchEngine = document.getElementById('searchEngine').value;

    if (keywords === "") {
        alert("Lütfen aramak istediğiniz anahtar kelimeleri girin.");
        return;
    }

    var fileType = document.querySelector('input[name="fileType"]:checked');
    var fileTypeValue = '';
    if (fileType) {
        fileTypeValue = fileType.value;
        if (fileTypeValue === "custom") {
            fileTypeValue = document.getElementById('customFileType').value;
            if (fileTypeValue === "") {
                alert("Lütfen özel bir dosya uzantısı girin.");
                return;
            }
        }
    }

    var dorkQuery = keywords;
    if (fileTypeValue) {
        dorkQuery += " filetype:" + fileTypeValue;
    }
    if (site !== "") {
        dorkQuery += " site:" + site;
    }

    if (document.getElementById('inurl').checked) dorkQuery += " inurl:" + keywords;
    if (document.getElementById('intitle').checked) dorkQuery += " intitle:" + keywords;
    if (document.getElementById('intext').checked) dorkQuery += " intext:" + keywords;
    if (document.getElementById('cache').checked) dorkQuery += " cache:" + site;
    if (document.getElementById('related').checked) dorkQuery += " related:" + site;
    if (document.getElementById('allintext').checked) dorkQuery += " allintext:" + keywords;
    if (document.getElementById('allintitle').checked) dorkQuery += " allintitle:" + keywords;
    if (document.getElementById('info').checked) dorkQuery += " info:" + site;

    var searchURL;
    if (searchEngine === "bing") {
        searchURL = "https://www.bing.com/search?q=" + encodeURIComponent(dorkQuery);
    } else if (searchEngine === "duckduckgo") {
        searchURL = "https://duckduckgo.com/?q=" + encodeURIComponent(dorkQuery);
    } else {
        searchURL = "https://www.google.com/search?q=" + encodeURIComponent(dorkQuery);
    }

    window.open(searchURL, '_blank');
}
