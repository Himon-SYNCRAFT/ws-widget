widgetOperatorListFavoriteWorkspace = new (function() {
    this.elementId = 'wirtualny-sklep';

    //INICIALIZACJA
    this.init = function () {
      this.element = document.getElementById(this.elementId),
      this.city = this.element.getAttribute('city'),
      this.postCode = this.element.getAttribute('postcode'),
      this.workspaceName = this.element.getAttribute('workspace-name'),
      this.workspaceCode = this.element.getAttribute('workspace-code'),
      this.operatorLogin = this.element.getAttribute('operator-login'),
      this.operatorName = this.element.getAttribute('operator-name'),
      this.operatorLastName = this.element.getAttribute('operator-lastname'),
      this.operatorStatus = this.element.getAttribute('operator-status'),
      this.apiKey = this.element.getAttribute('api-key'),
      this.params = {
          workspaceCity: this.city,
          workspaceCode: this.workspaceCode,
          workspacePostcode: this.postCode,
          //workspaceAddress: null,
          workspaceName: this.workspaceName,
          login: this.operatorLogin,
          name: this.operatorName,
          statusId: this.operatorStatus,
          apiKey: this.apiKey,
      }
      this.href = `https://apiwirtualny.eltrox.pl/api/v1/widget/operatorListFavoriteWorkspace?${this.queryString(this.params)}`
    }

    //---------------------------------------------
    //STYLE
    //---------------------------------------------
    this.objectToStyle = function(data) {
        const items = Object.entries(data).map(function(entry) {
            const key = entry[0]
            const value = entry[1]
            return `${key}: ${value}`
        })
        return items.join(';')
    }
    this.imageStyle = this.objectToStyle({
        'width': '100%'
    })
    this.contentStyle = this.objectToStyle({
        'padding': '1em',
        'margin-bottom': 'auto',
    })
    this.cardStyle = this.objectToStyle({
        'border': '1px solid #d4d4d5',
        'border-radius': '0.285714em',
        'display': 'flex',
        'flex-direction': 'column',
        'width': 'calc(20% - 1.5em)',
        'margin-left': '.75em',
        'margin-right': '.75em',
        'font-family': "Lato,'Helvetica Neue',Arial,Helvetica,sans-serif",
        'padding-top': '20px',
    })
    this.footerStyle = this.objectToStyle({
        'background-color': '#fcfcfc',
        'padding': '.78571429em 1.5em .78571429em',
        'border': 'none',
        'font-family': "Lato,'Helvetica Neue',Arial,Helvetica,sans-serif",
        'font-size': '14px',
    })


    this.createCard = function (operator) {
        const image = document.createElement('img')
        image.setAttribute('style', this.objectToStyle({
            'width': '70%',
        }))
        image.className = 'ws-image'
        image.setAttribute('src', operator.avatar)

        const imageDiv = document.createElement('div')
        imageDiv.setAttribute('style', this.objectToStyle({
            'text-align': 'center',
        }))
        imageDiv.appendChild(image)

        const content = document.createElement('div')
        content.className = 'ws-content'

        const header = document.createElement('div')
        header.className = 'ws-header'
        header.setAttribute('style', this.objectToStyle({
            'font-weight': 'bold',
            'font-size': '16px',
            'text-align': 'center',
        }))
        header.innerHTML = `${operator.name} ${operator.lastname}`
        content.appendChild(header)

        const line = document.createElement('div')
        line.className = 'ws-header'
        line.setAttribute('style', this.objectToStyle({
            'font-size': '14px',
            'text-align': 'center',
        }))
        line.innerHTML = `${operator.experienceText}`
        content.appendChild(line)

        const footer = document.createElement('div')
        if(operator.specialization.length > 1){
          footer.className = 'ws-footer'
          footer.innerHTML = `${operator.specialization}`
          content.appendChild(footer)
        }

        const card = document.createElement('div')
        card.className = 'ws-card'
        card.appendChild(imageDiv)
        card.appendChild(content)
        card.appendChild(footer)

        return card
    }

    this.getOperators = function() {
        _this = this;
        fetch(this.href)
            .then(function(response) {
                if (response.ok) {
                    return response.json()
                } else {
                    return Promise.reject(response)
                }
            })
            .then(function(data) {
                const css = `.ws-image {${_this.imageStyle}} .ws-content {${_this.contentStyle}} .ws-footer {${_this.footerStyle}} .ws-card {${_this.cardStyle}}`
                const style = document.createElement('style')
                if (style.styleSheet) {
                    style.styleSheet.cssText = css
                } else {
                    style.appendChild(document.createTextNode(css))
                }
                _this.element.innerHTML = ''

                const cards = document.createElement('div')
                cards.setAttribute('style', _this.objectToStyle({
                    'display': 'flex',
                    'flex-direction': 'row',
                }))

                if (data.operatorList && data.operatorList.length > 0) {

                    _this.element.appendChild(style)
                    data.operatorList.slice(0, 5).forEach(function(item) {
                        cards.appendChild(_this.createCard(item))
                    })
                    _this.element.appendChild(cards)
                }

            })
            .catch(function(error) {
                console.log('failure', error)
            })
    }

    //---------------------------------------------
    //FUNKCJE POMOCNICZE
    //---------------------------------------------
    this.queryString = function (params) {
      return Object.keys(params)
          .filter(function(key) {
              return !!params[key]
          })
          .map(function(key) {
              return `${key}=${params[key]}`
          }).join('&')
    }
    //window.setInterval(getOperators, 5000)
})
