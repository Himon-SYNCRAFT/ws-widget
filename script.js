(function (window, document) {
    const elementId = 'wirtualny-sklep'
    const element = document.getElementById(elementId)

    const city = element.getAttribute('city')
    const postCode = element.getAttribute('postcode')
    const workspace = element.getAttribute('workspace')
    const operatorLogin = element.getAttribute('operator-login')
    const operatorName = element.getAttribute('operator-name')
    const operatorLastName = element.getAttribute('operator-lastname')
    const operatorStatus = element.getAttribute('operator-status')
    const apiKey = element.getAttribute('api-key')

    const params = {
        workspaceCity: city,
        workspacePostcode: postCode,
        workspaceAddress: null,
        workspaceName: workspace,
        login: operatorLogin,
        name: operatorName,
        statusId: operatorStatus,
        apiKey: apiKey,
    }

    function queryString(params) {
        return Object.keys(params)
            .filter(function(key) {
                return !!params[key]
            })
            .map(function(key) {
                return `${key}=${params[key]}`
            }).join('&')
    }

    // const href = `https://apiwirtualny.eltrox.pl/api/v1/widget/operatorList?${queryString(params)}`
    const href = `https://apiwirtualny.eltrox.pl/api/v1/widget/getAllOperators?${queryString(params)}`

    const imageStyle = objectToStyle({
        'width': '100%'
    })

    const contentStyle = objectToStyle({
        padding: '1em',
        'margin-bottom': 'auto',
    })

    const cardStyle = objectToStyle({
        border: '1px solid #d4d4d5',
        'border-radius': '0.285714em',
        display: 'flex',
        'flex-direction': 'column',
        width: 'calc(20% - 1.5em)',
        'margin-left': '.75em',
        'margin-right': '.75em',
        'font-family': "Lato,'Helvetica Neue',Arial,Helvetica,sans-serif",
    })

    const buttonStyle = objectToStyle({
        'background-color': '#21ba45',
        'color': '#fff',
        padding: '.78571429em 1.5em .78571429em',
        border: 'none',
        'font-family': "Lato,'Helvetica Neue',Arial,Helvetica,sans-serif",
        'font-weight': 'bold',
        'font-size': '1rem',
        'text-decoration': 'none',
    })

    const buttonStyleDisabled = objectToStyle({
        'background-color': 'red',
    })

    const buttonStyleHover = objectToStyle({
        'background-color': '#16ab39',
    })

    function objectToStyle(data) {
        const items = Object.entries(data).map(function(entry) {
            const key = entry[0]
            const value = entry[1]
            return `${key}: ${value}`
        })

        return items.join(';')
    }

    function createCard(operator) {
        console.log(operator)
        const image = document.createElement('img')
        image.className = 'ws-image'
        image.setAttribute('src', operator.avatar)

        const imageDiv = document.createElement('div')
        imageDiv.appendChild(image)

        const content = document.createElement('div')
        content.className = 'ws-content'

        const header = document.createElement('div')
        header.className = 'ws-header'
        header.setAttribute('style', objectToStyle({
            'font-weight': 'bold',
            'font-size': '1.28571429em',
        }))
        header.innerHTML = `${operator.name} ${operator.lastname}`

        content.appendChild(header)

        const button = document.createElement('a')

        if (operator.statusId == 1) {
            button.setAttribute('href', `https://wirtualny.eltrox.pl/chat/operator/${operator.operatorId}`)
            button.className = 'ws-button'
            button.innerHTML = 'Rozpocznij konsultację online'
        } else {
            button.setAttribute('href', `https://wirtualny.eltrox.pl/company/1`)
            button.innerHTML = 'Konsultant niedostępny'
            button.className = 'ws-button ws-button-disabled'
        }

        button.setAttribute('target', '_blank')

        const card = document.createElement('div')
        card.className = 'ws-card'
        card.appendChild(imageDiv)
        card.appendChild(content)
        card.appendChild(button)

        return card
    }

    function getOperators() {
        fetch(href)
            .then(function(response) {
                if (response.ok) {
                    return response.json()
                } else {
                    return Promise.reject(response)
                }
            })
            .then(function(data) {
                const css = `.ws-image {${imageStyle}} .ws-content {${contentStyle}} .ws-card {${cardStyle}} .ws-button {${buttonStyle}} .ws-button:hover {${buttonStyleHover}} .ws-button-disabled {${buttonStyleDisabled}}`
                const style = document.createElement('style')

                if (style.styleSheet) {
                    style.styleSheet.cssText = css
                } else {
                    style.appendChild(document.createTextNode(css))
                }

                element.innerHTML = ''

                const cards = document.createElement('div')
                cards.setAttribute('style', objectToStyle({
                    'display': 'flex',
                    'flex-direction': 'row',
                }))

                if (data.operatorList && data.operatorList.length > 0) {
                    element.appendChild(style)

                    data.operatorList.slice(0, 10).forEach(function(item) {
                        cards.appendChild(createCard(item))
                    })

                    element.appendChild(cards)
                }

            })
            .catch(function(error) {
                console.log('failure', error)
            })
    }

    getOperators()

    window.setInterval(getOperators, 5000)
})(window, document)
