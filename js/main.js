Ext.namespace("GEOR.Addons");

GEOR.Addons.Dangerzone = Ext
		.extend(
				GEOR.Addons.Base,
				{

					map : this.map,
					/**
					 * init the client in the tools menu of mapfishapp
					 */
					init : function(record) {

						var lang = OpenLayers.Lang.getCode();
						map = this.map;
						mapProjection = map.getProjection();
						if (this.target) {
							this.components = this.target.insertButton(
									this.position, {
										xtype : 'button',
										enableToggle : true,
										tooltip : this.getTooltip(record),
										iconCls : 'addon-dangerzone',
										listeners : {
											"toggle" : this.showWindow,
											scope : this
										}
									});
							this.target.doLayout();
						} else {
							this.item = new Ext.menu.Item({
								id : 'checkBox_DZ',
								text : this.getText(record),
								qtip : this.getQtip(record),
								checked : false,
								listeners : {
									"click" : this.showWindow,
									scope : this
								}

							});
						}
						GEOR.WPS_Utils.initProj4jsGlobalVar();

					},

					/**
					 * show the configuration window
					 */
					showWindow : function() {

						if (!this.win) {

							serverStore = GEOR.WPS_Utils.initServerStore();
							serverStore.load();

							this.combo_Server_1_DZ = GEOR.WPS_Utils
									.initCombobox(
											'combo_server_1_DZ',
											serverStore,
											OpenLayers
													.i18n("dangerzone.workspace"),
											'url', 'name', false);
							this.combo_Server_1_DZ.on('select', function(combo,
									record) {
								GEOR.WPS_Utils.loadNextDataStore(Ext
										.getCmp('combo_Server_1_DZ'), record
										.get('url'), Ext
										.getCmp('combo_layer_1_DZ'));
								Ext.getCmp('combo_layer_1_DZ').setDisabled(
										false);
							});
							this.combo_Server_2_DZ = GEOR.WPS_Utils
									.initCombobox(
											'combo_server_2_DZ',
											serverStore,
											OpenLayers
													.i18n("dangerzone.workspace"),
											'url', 'name', false);
							this.combo_Server_2_DZ.on('select', function(combo,
									record) {
								GEOR.WPS_Utils.loadNextDataStore(Ext
										.getCmp('combo_Server_2_DZ'), record
										.get('url'), Ext
										.getCmp('combo_layer_2_DZ'));
								Ext.getCmp('combo_layer_2_DZ').setDisabled(
										false);
							});
							this.combo_Layers_1_DZ = GEOR.WPS_Utils
									.initCombobox(
											'combo_layer_1_DZ',
											this.layerStore,
											OpenLayers
													.i18n("dangerzone.firstlayer"),
											'layer', 'name', true);
							this.combo_Layers_2_DZ = GEOR.WPS_Utils
									.initCombobox(
											'combo_layer_2_DZ',
											this.layerStore,
											OpenLayers
													.i18n("dangerzone.secondlayer"),
											'layer', 'name', true);

							this.combo_Layers_1_DZ
									.on(
											'select',
											function(combo, record) {
												layername_1 = GEOR.WPS_Utils
														.getLayerName(combo);
												workspace_1 = GEOR.WPS_Utils
														.getWorkspace(
																combo,
																Ext
																		.getCmp('combo_server_1_DZ'));
											});
							this.combo_Layers_2_DZ
									.on(
											'select',
											function(combo, record) {
												layername_2 = GEOR.WPS_Utils
														.getLayerName(combo);
												workspace_2 = GEOR.WPS_Utils
														.getWorkspace(
																combo,
																Ext
																		.getCmp('combo_server_2_DZ'));
											});

							this.win = new Ext.Window(
									{
										title : "Configuration",
										height : 400,
										width : 350,
										bodyStyle : 'padding: 5px',
										layout : 'form',
										labelWidth : 110,
										defaultType : 'field',
										items : [
												{
													xtype : 'box',
													height : 30,
													style : {
														fontSize : '15px',
														fontWeight : '800'
													},
													autoEl : {
														tag : 'div',
														html : OpenLayers
																.i18n("dangerzone.firstlayer")
													}
												},
												this.combo_Server_1_DZ,
												this.combo_Layers_1_DZ,
												{
													fieldLabel : OpenLayers
															.i18n("dangerzone.distance"),
													width : 200,
													id : 'distance_1',
													allowBlank : false

												},
												{
													fieldLabel : OpenLayers
															.i18n("dangerzone.attributeName"),
													width : 200,
													id : 'attributeName_1',
													allowBlank : false

												},
												{
													xtype : 'box',
													height : 30,
													style : {
														fontSize : '15px',
														fontWeight : '800'
													},

													autoEl : {
														tag : 'div',
														html : OpenLayers
																.i18n("dangerzone.secondlayer")
													}
												},
												this.combo_Server_2_DZ,
												this.combo_Layers_2_DZ,
												{
													fieldLabel : OpenLayers
															.i18n("dangerzone.distance"),
													width : 200,
													id : 'distance_2',
													allowBlank : false

												},
												{
													fieldLabel : OpenLayers
															.i18n("dangerzone.attributeName"),
													width : 200,
													id : 'attributeName_2',
													allowBlank : false
												},
												{
													xtype : 'box',
													height : 30,
													style : {
														fontSize : '15px',
														fontWeight : '800'
													},

													autoEl : {
														tag : 'div',
														html : OpenLayers
																.i18n("dangerzone.layersprojection")
													}
												},
												{
													fieldLabel : OpenLayers
															.i18n("dangerzone.layersprojection.label"),
													width : 200,
													id : 'projection',
													allowBlank : false,
												}

										],
										fbar : [
												'->',
												{
													text : OpenLayers
															.i18n("dangerzone.submit"),
													id : 'submit_DZ',
													formBind : true,
													handler : function() {
														// get inserted value
														// for the first layer
														distance_1 = Ext
																.getCmp(
																		'distance_1')
																.getValue();
														attributeName_1 = Ext
																.getCmp(
																		'attributeName_1')
																.getValue();

														// get inserted value
														// for the second layer
														distance_2 = Ext
																.getCmp(
																		'distance_2')
																.getValue();
														attributeName_2 = Ext
																.getCmp(
																		'attributeName_2')
																.getValue();

														if (layername_1 == ""
																|| layername_2 == "") {
															Ext.Msg
																	.alert(
																			'Warning',
																			OpenLayers
																					.i18n("dangerzone.warning.message"));
															return;
														}

														this.win.hide();
														this.executeWPS();
													},

													scope : this
												} ],
										listeners : {
											"hide" : function() {
												// this.map.removeLayer(this.layer);
												// this.item &&
												// this.item.setChecked(false);
												// this.components &&
												// this.components.toggle(false);
												// alert("we are here");
											},
											scope : this
										}
									});

						}

						this.win.show();

					},

					/**
					 * reconstitute and execute the WPS request
					 */
					executeWPS : function() {

						GEOR.waiter.show();

						var wpsFormat = new OpenLayers.Format.WPSExecute();

						var result = wpsFormat
								.write({
									identifier : "gs:IntersectionFeatureCollection",
									dataInputs : [
											{
												identifier : 'first feature collection',
												reference : {
													mimeType : "text/xml; subtype=gml/3.1.1",
													href : "http://geoserver/wps",
													method : "POST",
													body : {
														identifier : "gs:BufferFeatureCollection",
														dataInputs : [
																{
																	identifier : 'features',
																	reference : {
																		mimeType : "text/xml; subtype=wfs-collection/1.0",
																		href : "http://geoserver/wfs",
																		method : "POST",
																		body : {
																			wfs : {
																				version : "1.0.0",
																				outputFormat : "text/xml",
																				featureType : layername_1,
																				featurePrefix : workspace_1

																			}
																		}
																	}
																},
																{
																	identifier : "distance",
																	data : {
																		literalData : {
																			value : distance_1
																		}
																	}
																},
																{
																	identifier : "attributeName",
																	data : {
																		literalData : {
																			value : attributeName_1
																		}
																	}
																} ],
														responseForm : {
															rawDataOutput : {
																mimeType : "text/xml; wfs-collection/1.0",
																identifier : "result"
															}
														}
													}
												}
											},
											{
												identifier : 'second feature collection',
												reference : {
													mimeType : "text/xml; subtype=gml/3.1.1",
													href : "http://geoserver/wps",
													method : "POST",
													body : {
														identifier : "gs:BufferFeatureCollection",
														dataInputs : [
																{
																	identifier : 'features',
																	reference : {
																		mimeType : "text/xml; subtype=wfs-collection/1.0",
																		href : "http://geoserver/wfs",
																		method : "POST",
																		body : {
																			wfs : {
																				version : "1.0.0",
																				outputFormat : "text/xml",
																				featureType : layername_2,
																				featurePrefix : workspace_2
																			}
																		}
																	}
																},
																{
																	identifier : "distance",
																	data : {
																		literalData : {
																			value : distance_2
																		}
																	}
																},
																{
																	identifier : "attributeName",
																	data : {
																		literalData : {
																			value : attributeName_2
																		}
																	}
																}

														],
														responseForm : {
															rawDataOutput : {
																mimeType : "text/xml; subtype=wfs-collection/1.0",
																identifier : "result"
															}
														}
													}
												}
											},
											{
												identifier : "first attributes to retain",
												data : {
													literalData : {
														value : attributeName_1
													}
												}
											},
											{
												identifier : "second attributes to retain",
												data : {
													literalData : {
														value : attributeName_2
													}
												}
											}

									],
									responseForm : {
										rawDataOutput : {
											mimeType : "text/xml; subtype=wfs-collection/1.0",
											identifier : "result"
										}
									}
								});

						OpenLayers.Request
								.POST({
									url : GEOR.custom.GEOSERVER_WPS_URL,
									data : result,
									success : function(response) {
										var features = new OpenLayers.Format.WFST.v1_0_0()
												.read(response.responseText);
										var layerProjection = "EPSG:"
												+ Ext.getCmp('projection')
														.getValue();
										// prepare to style the data
										styleMap = new OpenLayers.StyleMap({
											strokeColor : "blue",
											strokeWidth : 8,
											strokeOpacity : 1,
											fillOpacity : 0.5
										});
										var wfs = new OpenLayers.Layer.Vector(
												"vector",
												{
													projection : layerProjection,
													styleMap : styleMap,
													preFeatureInsert : function(
															feature) {
														feature.geometry
																.transform(
																		layerProjection,
																		map
																				.getProjection())
													}
												});

										if (features
												&& (features instanceof OpenLayers.Feature.Vector || features.length)) {
											wfs.addFeatures(features);
											this.map.addLayers([ wfs ]);
										} else {
											Ext.MessageBox
													.show({
														title : 'Warning',
														msg : 'The wps process execution ended with problem',
														buttons : Ext.MessageBox.OK
													});

										}

										GEOR.waiter.hide();

									},
									failure : function(response) {
										alert("failure!");
										alert(response.responseText);
										GEOR.waiter.hide();
									}
								});

					},
					/**
					 * destroy the tool
					 */
					destroy : function() {
						GEOR.Addons.Base.prototype.destroy.call(this);

					}
				});
