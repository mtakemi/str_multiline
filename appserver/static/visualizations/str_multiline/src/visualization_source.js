/*
 * Visualization source
 */

define([
  'jquery',
  'underscore',
  '@fortawesome/fontawesome-free',
  'api/SplunkVisualizationBase',
  'api/SplunkVisualizationUtils'
  // Add required assets to this list
],
function(
  $,
  _,
  fa,
  SplunkVisualizationBase,
  vizUtils
) {
  
  // Extend from SplunkVisualizationBase
  return SplunkVisualizationBase.extend({
    initialize: function() {
      SplunkVisualizationBase.prototype.initialize.apply(this, arguments);
      this.$el = $(this.el);

      this.$el.append('<div class="str-multiline-container"></div>');
      
      // Initialization logic goes here
    },

    // Optionally implement to format data returned from search. 
    // The returned object will be passed to updateView as 'data'
    formatData: function(data) {
      // Format data 
      return data;
    },

    _getProperty(config, key, def){
      return config[this.getPropertyNamespaceInfo().propertyNamespace + key] || def
    },

    _getItem(rows, idx){
      if(rows.length > idx){
        return rows[idx]
      }
      return rows[rows.length - 1]
    },
    _getColumn(rows, fields, field, rowIdx = 0, defval = null){
      if(rows.length > rowIdx){
        let idx = -1
        for(let _idx = 0; _idx < fields.length; ++_idx){
          let v = fields[_idx]
          if(v.name == field){
            idx = _idx
            break;
          }
        }
        if(idx >= 0){
          let ret = rows[rowIdx][idx] || defval;
          return ret;
        }
      }
      return defval
    },
    _getArrayMV(val){
      if(Array.isArray(val)){
        return val
      }
      return val.split("\n")
    },

    // Implement updateView to render a visualization.
    //  'data' will be the data object returned from formatData or from the search
    //  'config' will be the configuration property object
    updateView: function(data, config) {
      //console.log(data, config)
      let row = data.rows
      let fields = data.fields

      if(row.length <= 0) return;

      this.config = config
      let textAlign = this._getProperty(config, 'textAlign', "center")
      let fontSize = this._getProperty(config, 'fontSize', "")
      this.fontSize = fontSize

      let target = this.$el
      target.empty()

      let texts = this._getArrayMV(this._getColumn(row, fields, 'text', 0, ""))
      let icons = this._getArrayMV(this._getColumn(row, fields, 'icon', 0, ""))
      let colors = this._getArrayMV(this._getColumn(row, fields, 'color', 0, "black"))

      let parts = []
      for(let n1 = 0; n1 < texts.length; ++n1){
        let txt = texts[n1]
        let color = this._getItem(colors, n1)
        //let divTmp = $('<div style="color: '+color+'"/>')
        let divTmp = $('<div>', { 
         'style': "color: "+color + "; text-align: " + textAlign
        })
        if(icons){
          let icon = this._getItem(icons, n1)
          let iconTag = $('<i>', {
            'class': "fa-solid fa-" + icon,
            //'class': "fa-solid fa-car",
            //'style': 'color: blue',
            'style': 'color: ' + color,
          })
          divTmp.append(iconTag)
        }
        divTmp.append(txt)
        parts.push(divTmp)
      }

      //txt = '<i class="fas fa-address-book"></i>' + txt
      //let html = parts.join("")
      let p = $('<div>', {'class': 'str-multiline-child', 'html': parts})
      
      let div = $('<div>', {'class': 'str-multiline'})
      //div.append('<i class="fas fa-address-book"></i>')
      div.append(p)

      target.append(div)

      target = this.$el.find('.str-multiline')
      this.resizeFont(target)
    },
    resizeFont: function(target){
      let fontSize = target.width() / 10;
      if(this.fontSize){
        fontSize = this.fontSize
      }
      let len = target.text().length;
      //console.log('resizeFont', target.width(), fontSize, len, target.text().split("\n"), target, $.fn.jquery)
      target.css('font-size', fontSize + "px");
      target.css('line-height', fontSize + "px");
    },

    // Search data params
    getInitialDataParams: function() {
      return ({
        outputMode: SplunkVisualizationBase.ROW_MAJOR_OUTPUT_MODE,
        count: 10000
      });
    },

    // Override to respond to re-sizing events
    reflow: function() {
      let target = this.$el.find('.str-multiline')
      //console.log('reflow', target)
      if(target){
        this.resizeFont(target)
      }
    }
  });
});
