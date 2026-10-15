        <div id="block_almacenes" class="main_block">
            <div id="block_almacenes_inner" class="main_block_inner">

                <div id="bl_buscar_almacenes" class="wr_bl_buscar">

                    <div class="wr_bl_buscar_head">
                        <h4 onclick="loadAlmacenesAll();">Almacenes</h4>
                        <div class="wr_btn_img" onclick="openModal('full','Buscar Almacen',null,'buildBuscarAlmacen', true, 'ver');">
                            <img class="btn_img" src="./images/search_zoom_icon_white.svg">
                        </div>
                    </div>

                    <div class="wr_bl_buscar_body">
                        <div class="find_result">

                            <div class="find_text disp_flex">
                                <span class="f_frase">(Todos registros)</span>
                                <span class="f_num">--</span>
                            </div>

                            <div id="filtros_aplicados_almacenes" class="wr_filtros_aplicados">

                                <div class="wr_filtros_aplicados_inner">
                                    
                                    <div class="fa_busqueda">
                                        <span>Tu búsqueda:</span>
                                    </div>
                                    
                                    <div class="fa_option fa_def fa_cursor" onclick="">
                                        <span>Todos registros</span>
                                    </div>

                                    <div class="fa_option fa_def" onclick="">
                                        <span>Almacenes</span>
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

                </div>

                <div id="contenedor_almacenes" class="wr_d_almacenes wr_d_arts">

                    <div class="d_almacen d_art" data-tipo_art="almacen" data-id_almacen="5">
                        <div class="datos_almacen datos_art">
                            <div class="da_nombre">Almacen 1 - Alcorcón</div>
                            <div class="da_dir">C. Porto Cristo, 1 posterior, Local 16, 28924 Alcorcón, Madrid</div>
                            <div class="da_com">almacen fiel</div>
                        </div>

                        <div class="tres_puntos">
                            <img class="btn_img" src="./images/tres_puntos_vertical_white.svg">
                        </div>
                        <div class="tres_puntos_menu">
                            <div onclick="openModal('full','Almacen actual',null,'buildAlmacen',true, 'ver');">
                                <img class="img_acts img_ver" src="./images/img_ver_white_24x24.png">
                            </div>
                            <div onclick="openModal('full','Almacen actual',null,'buildAlmacen',true, 'editar');">
                                <img class="img_acts img_editar" src="./images/img_editar_white_24x24.png">
                            </div>
                            <div onclick="openModal('full','Almacen actual',null,'buildAlmacen',true, 'eliminar');">
                                <img class="img_acts img_eliminar" src="./images/img_eliminar_white_24x24.png">
                            </div>
                        </div>

                    </div>


                </div><!--/.wr_d_almacenes -->

                <button id="btn_add_almacen" class="btn_add" onclick="openModal('full', 'Crear Almacen', null, 'buildAlmacen', true, 'nuevo');">+</button>

            </div><!--/#block_almacenes_inner -->
        </div><!--/#block_almacenes -->
