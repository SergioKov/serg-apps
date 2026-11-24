        <div id="block_conceptos" class="main_block">
            <div id="block_conceptos_inner" class="main_block_inner">

                <div id="bl_buscar_conceptos" class="wr_bl_buscar">

                    <div class="wr_bl_buscar_head">
                        <h4 onclick="loadConceptosAll();">Conceptos</h4>
                        <div class="wr_btn_img" onclick="openModal('full','Buscar Concepto',null,'buildBuscarConcepto', true, 'ver');">
                            <img class="btn_img" src="./images/search_zoom_icon_white.svg">
                        </div>
                    </div>

                    <div class="wr_bl_buscar_body">
                        <div class="find_result">

                            <div class="find_text disp_flex">
                                <span class="f_frase">(Todos registros)</span>
                                <span class="f_num">--</span>
                            </div>

                            <div id="filtros_aplicados_conceptos" class="wr_filtros_aplicados">

                                <div class="wr_filtros_aplicados_inner">
                                    
                                    <div class="fa_busqueda">
                                        <span>Tu búsqueda:</span>
                                    </div>
                                    
                                    <div class="fa_option fa_def fa_cursor" onclick="">
                                        <span>Todos registros</span>
                                    </div>

                                    <div class="fa_option fa_def" onclick="">
                                        <span>Conceptos</span>
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

                </div><!--/#bl_buscar_conceptos -->

                <div id="contenedor_conceptos" class="wr_d_conceptos wr_d_arts">

                    <div class="d_concepto d_art" data-tipo_art="concepto" data-id_concepto="5">
                        <div class="datos_concepto datos_art">
                            <div class="wr_id_nombre">
                                <div class="da_id">15</div>
                                <div class="da_nombre">Nombre Concepto (Ejemplo)</div>
                            </div>
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
                            <div onclick="openModal('full','Concepto actual',null,'buildConcepto',true, 'ver');">
                                <img class="img_acts img_ver" src="./images/img_ver_white_24x24.png">
                            </div>
                            <div onclick="openModal('full','Concepto actual',null,'buildConcepto',true, 'editar');">
                                <img class="img_acts img_editar" src="./images/img_editar_white_24x24.png">
                            </div>
                            <div onclick="openModal('full','Concepto actual',null,'buildConcepto',true, 'eliminar');">
                                <img class="img_acts img_eliminar" src="./images/img_eliminar_white_24x24.png">
                            </div>
                        </div>

                    </div>

                </div><!--/#contenedor_conceptos -->

                <button id="btn_add_concepto" class="btn_add" onclick="addConcepto()">+</button>

            </div><!--/#block_conceptos_inner -->
        </div><!--/#block_conceptos -->
