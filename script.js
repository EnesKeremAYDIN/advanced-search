document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('excludeWords').addEventListener('change', function() {
        document.getElementById('excludeWordsInput').classList.toggle('hidden', !this.checked);
    });

    document.getElementById('before').addEventListener('change', toggleDateFilters);
    document.getElementById('after').addEventListener('change', toggleDateFilters);

    document.getElementById('loc').addEventListener('change', function() {
        document.getElementById('locationFilter').classList.toggle('hidden', !this.checked);
    });
});

function toggleDateFilters() {
    const beforeChecked = document.getElementById('before').checked;
    const afterChecked = document.getElementById('after').checked;
    document.getElementById('dateFilters').classList.toggle('hidden', !beforeChecked && !afterChecked);
}

function selectSuggestedSite() {
    const selectedSite = document.getElementById('siteSuggestions').value;
    document.getElementById('siteName').value = selectedSite;
}

document.querySelectorAll('input[name="fileType"]').forEach((input) => {
    input.addEventListener('change', function () {
        const customInput = document.getElementById('customFileTypeInput');
        if (this.value === 'custom') {
            customInput.style.display = 'flex';
            customInput.querySelector('input').focus();
        } else {
            customInput.style.display = 'none';
        }
    });
});

function performSearch() {
    const keywords = document.getElementById('searchKeywords').value;
    const site = document.getElementById('siteName').value;
    const searchEngine = document.getElementById('searchEngine').value;

    if (!keywords.trim()) {
        alert("Please enter keywords to search for.");
        document.getElementById('searchKeywords').focus();
        return;
    }

    let searchQuery = '';

    if (document.getElementById('exactPhrase').checked) {
        searchQuery = `"${keywords}"`;
    } else {
        searchQuery = keywords;
    }

    if (document.getElementById('excludeWords').checked) {
        const excludedWords = document.getElementById('wordsToExclude').value
            .split(',')
            .map(word => word.trim())
            .filter(word => word)
            .map(word => `-${word}`);
        
        if (excludedWords.length > 0) {
            searchQuery += ' ' + excludedWords.join(' ');
        }
    }

    let fileType = document.querySelector('input[name="fileType"]:checked');
    if (fileType) {
        const fileTypeValue = fileType.value;
        if (fileTypeValue === "custom") {
            const customType = document.getElementById('customFileType').value.trim();
            if (!customType) {
                alert("Please enter a custom file extension.");
                document.getElementById('customFileType').focus();
                return;
            }
            searchQuery += ` filetype:${customType}`;
        } else {
            searchQuery += ` filetype:${fileTypeValue}`;
        }
    }

    if (site) {
        searchQuery += ` site:${site}`;
    }

    if (document.getElementById('before').checked) {
        const beforeDate = document.getElementById('beforeDate').value;
        if (beforeDate) {
            searchQuery += ` before:${beforeDate}`;
        }
    }

    if (document.getElementById('after').checked) {
        const afterDate = document.getElementById('afterDate').value;
        if (afterDate) {
            searchQuery += ` after:${afterDate}`;
        }
    }

    if (document.getElementById('loc').checked) {
        const location = document.getElementById('location').value.trim();
        if (location) {
            searchQuery += ` location:${location}`;
        }
    }

    const searchOperators = {
        'inurl': keywords,
        'intitle': keywords,
        'intext': keywords,
        'cache': site,
        'related': site,
        'allintext': keywords,
        'allintitle': keywords,
        'info': site,
        'link': site,
        'ext': fileType ? fileType.value : '',
        'define': keywords,
    };

    Object.entries(searchOperators).forEach(([operator, value]) => {
        if (document.getElementById(operator)?.checked && value) {
            searchQuery += ` ${operator}:${value}`;
        }
    });

    const searchURLs = {
        'google': 'https://www.google.com/search?q=',
        'bing': 'https://www.bing.com/search?q=',
        'duckduckgo': 'https://duckduckgo.com/?q=',
        'yandex': 'https://yandex.com/search/?text=',
        'baidu': 'https://www.baidu.com/s?wd='
    };

    const searchURL = searchURLs[searchEngine] + encodeURIComponent(searchQuery);
    window.open(searchURL, '_blank');
}
