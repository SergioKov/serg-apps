        <div id="block_pedidos" class="main_block">
            <div id="block_pedidos_inner" class="main_block_inner">

            <div id="bl_buscar_pedidos" class="wr_bl_buscar">

                <div class="wr_bl_buscar_head">
                    <h4 onclick="loadPedidosAll();">Pedidos</h4>
                    <div class="wr_btn_img" onclick="openModal('full','Buscar Pedido',null,'buildBuscarPedido', true, 'ver');">
                        <img class="btn_img" src="./images/search_zoom_icon_white.svg">
                    </div>
                </div>

                <div class="wr_bl_buscar_body">
                    <div class="find_result">

                        <div class="find_text disp_flex">
                            <span class="f_frase">(Todos registros)</span>
                            <span class="f_num">--</span>
                        </div>

                        <div id="filtros_aplicados_pedidos" class="wr_filtros_aplicados">

                            <div class="wr_filtros_aplicados_inner">
                                
                                <div class="fa_busqueda">
                                    <span>Tu búsqueda:</span>
                                </div>
                                
                                <div class="fa_option fa_def fa_cursor" onclick="">
                                    <span>Todos registros</span>
                                </div>

                                <div class="fa_option fa_def" onclick="">
                                    <span>Pedidos</span>
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

            </div><!--/#bl_buscar_pedidos -->


                <div id="contenedor_pedidos" class="wr_d_pedidos wr_d_arts">

                    <div class="d_pedido d_art" data-id_pedido="4" data-id_cliente="2" data-tipo_art="pedido">
                        <div class="datos_pedido datos_art">
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

                    



                </div><!--/.wr_d_pedidos -->


                <button id="btn_add_pedido" class="btn_add" onclick="openModal('full', 'Crear Pedido', null, 'buildPedido', true, 'nuevo');">+</button>


            </div><!--/#block_pedidos_inner -->
        </div><!--/#block_pedidos -->
