        <div id="block_tarifas" class="main_block">
            <div id="block_tarifas_inner" class="main_block_inner">

                <div id="bl_buscar_tarifas" class="wr_bl_buscar">

                    <div class="wr_bl_buscar_head">
                        <h4 onclick="loadTarifasAll();">Tarifas</h4>
                        <div class="wr_btn_img" onclick="openModal('full','Buscar Tarifa',null,'buildBuscarTarifa', true, 'ver');">
                            <img class="btn_img" src="./images/search_zoom_icon_white.svg">
                        </div>
                    </div>

                    <div class="wr_bl_buscar_body">
                        <div class="find_result">

                            <div class="find_text disp_flex">
                                <span class="f_frase">(Todos registros)</span>
                                <span class="f_num">--</span>
                            </div>

                            <div id="filtros_aplicados_tarifas" class="wr_filtros_aplicados">

                                <div class="wr_filtros_aplicados_inner">
                                    
                                    <div class="fa_busqueda">
                                        <span>Tu búsqueda:</span>
                                    </div>
                                    
                                    <div class="fa_option fa_def fa_cursor" onclick="">
                                        <span>Todos registros</span>
                                    </div>

                                    <div class="fa_option fa_def" onclick="">
                                        <span>Tarifas</span>
                                    </div>
                                    
                                    <div class="fa_option" data-cbox_id="cbox2">
                                        <span>5) Frase exacta</span>
                                        <span class="sp_close">✕</span>
                                    </div>
                                    
                                    <div class="fa_option" data-cbox_id="cbox4">
                                        <span>1) Campos por defecto</span>
                                        <span class="sp_close">✕</span>
                                    </div>
                                
                                </div><!--/.wr_filtros_aplicados_inner-->



                            </div><!--/.wr_filtros_aplicados-->
                        </div><!--/.find_result-->


                    </div><!--/.wr_bl_buscar_body-->

                </div><!--/#bl_buscar_tarifas -->

                <div id="contenedor_tarifas" class="wr_d_tarifas wr_d_arts">

                    <div class="d_tarifa d_art" data-tipo_art="tarifa" data-id_tarifa="5">
                        <div class="datos_tarifa datos_art">
                            <div class="da_nombre">Nombre Tarifa (Ejemplo)</div>
                            <div class="da_com">descripcion aki...</div>
                        </div>

                        <div class="art_cols art_col3">
                            <div>14 €</div>
                        </div>

                        <div class="art_cols art_col4">
                            <div>24 €</div>
                        </div>


                        <div class="tres_puntos">
                            <img class="btn_img" src="./images/tres_puntos_vertical_white.svg">
                        </div>
                        <div class="tres_puntos_menu">
                            <div onclick="openModal('full','Tarifa actual',null,'buildTarifa',true, 'ver');">
                                <img class="img_acts img_ver" src="./images/img_ver_white_24x24.png">
                            </div>
                            <div onclick="openModal('full','Tarifa actual',null,'buildTarifa',true, 'editar');">
                                <img class="img_acts img_editar" src="./images/img_editar_white_24x24.png">
                            </div>
                            <div onclick="openModal('full','Tarifa actual',null,'buildTarifa',true, 'eliminar');">
                                <img class="img_acts img_eliminar" src="./images/img_eliminar_white_24x24.png">
                            </div>
                        </div>

                    </div>

                </div><!--/#contenedor_tarifas -->

                <button id="btn_add_tarifa" class="btn_add" onclick="openModal('full', 'Crear Tarifa', null, 'buildTarifa', true, 'nuevo');">+</button>

            </div><!--/#block_tarifas_inner -->
        </div><!--/#block_tarifas -->
