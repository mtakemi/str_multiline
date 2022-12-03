/*
 * Visualization source
 */

define([
  'jquery',
  'underscore',
  'api/SplunkVisualizationBase',
  'api/SplunkVisualizationUtils'
  // Add required assets to this list
],
function(
  $,
  _,
  SplunkVisualizationBase,
  vizUtils
) {
  
  // Extend from SplunkVisualizationBase
  return SplunkVisualizationBase.extend({
    initialize: function() {
      SplunkVisualizationBase.prototype.initialize.apply(this, arguments);
      this.$el = $(this.el);

      this.$el.append('<div id="helloworld_id">hello, world</div>');
      
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

    // Implement updateView to render a visualization.
    //  'data' will be the data object returned from formatData or from the search
    //  'config' will be the configuration property object
    updateView: function(data, config) {
      console.log(data)

      let something = this._getProperty(config, 'something', 'nothing')
      console.log(config, something)
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
      if(this.isInitialized && this.map){
        this.map.invalidateSize()
      }
    }
  });
});
