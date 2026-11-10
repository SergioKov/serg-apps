<div id="block_movimientos" class="main_block">
            <div id="block_movimientos_inner" class="main_block_inner">

            <div id="bl_buscar_movimientos" class="wr_bl_buscar">

                <div class="wr_bl_buscar_head">
                    <h4 onclick="loadMovimientosAll();">Movimientos</h4>
                    <div class="wr_btn_img" onclick="openModal('full','Buscar Movimiento',null,'buildBuscarMovimiento', true, 'ver');">
                        <img class="btn_img" src="./images/search_zoom_icon_white.svg">
                    </div>
                </div>

                <div class="wr_bl_buscar_body">
                    <div class="find_result">

                        <div class="find_text disp_flex">
                            <span class="f_frase">(Todos registros)</span>
                            <span class="f_num">--</span>
                        </div>

                        <div id="filtros_aplicados_movimientos" class="wr_filtros_aplicados">

                            <div class="wr_filtros_aplicados_inner">
                                
                                <div class="fa_busqueda">
                                    <span>Tu búsqueda:</span>
                                </div>
                                
                                <div class="fa_option fa_def fa_cursor" onclick="">
                                    <span>Todos registros</span>
                                </div>

                                <div class="fa_option fa_def" onclick="">
                                    <span>Movimientos</span>
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

            </div><!--/#bl_buscar_movimientos -->


                <div id="contenedor_movimientos" class="wr_d_movimientos wr_d_arts">

                    <div class="d_movimiento d_art" data-id_movimiento="4" data-id_cliente="2" data-tipo_art="movimiento">
                        <div class="datos_movimiento datos_art">
                            <div class="da_diasem">Martes</div>
                            <div class="da_fechahora">
                                <div class="da_fecha">20.10.2026</div>
                                <div class="da_hora">09:59</div>
                            </div>
                            <div class="da_nombre">Ejemplo Nombre Cliente</div>
                            <div class="da_tel">+34 622315345</div>
                        </div>
                        <div class="art_cols art_col2">
                            <div class="da_kvadrat ocupado"></div>
                        </div>
                        <div class="art_cols art_col3">
                            <div class="da_bola pendiente"></div>
                        </div>
                        <div class="art_cols art_col4">
                            <div class="da_subtotal">100.00 €</div>
                            <div class="da_iva_total">21.00 €</div>
                            <div class="da_total">121.00 €</div>
                        </div>


                        <div class="tres_puntos">
                            <img class="btn_img" src="./images/tres_puntos_vertical_white.svg">
                        </div>

                        <div class="tres_puntos_menu">
                            <div class="d_ver">
                                <img class="img_acts img_ver" src="./images/img_ver_white_24x24.png">
                            </div>
                            <div class="d_editar">
                                <img class="img_acts img_editar" src="./images/img_editar_white_24x24.png">
                            </div>
                            <div class="d_eliminar">
                                <img class="img_acts img_eliminar" src="./images/img_eliminar_white_24x24.png">
                            </div>
                        </div>    
                    </div>

                    



                </div><!--/.wr_d_movimientos -->


                <button id="btn_add_movimiento" class="btn_add" onclick="addMovimiento()">+</button>


            </div><!--/#block_movimientos_inner -->
        </div><!--/#block_movimientos -->
