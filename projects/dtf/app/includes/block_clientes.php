        <div id="block_clientes" class="main_block">
            <div id="block_clientes_inner" class="main_block_inner">

                <div id="bl_buscar_clientes" class="wr_bl_buscar">

                    <div class="wr_bl_buscar_head">
                        <h4 onclick="loadClientesAll();">Clientes</h4>
                        <div class="wr_btn_img" onclick="openModal('full','Buscar Cliente',null,'buildBuscarCliente', true, 'ver');">
                            <img class="btn_img" src="./images/search_zoom_icon_white.svg">
                        </div>
                    </div>

                    <div class="wr_bl_buscar_body">
                        <div class="find_result">

                            <div class="find_text disp_flex">
                                <span class="f_frase">(Todos registros)</span>
                                <span class="f_num">--</span>
                            </div>

                            <div id="filtros_aplicados_clientes" class="wr_filtros_aplicados">

                                <div class="wr_filtros_aplicados_inner">
                                    
                                    <div class="fa_busqueda">
                                        <span>Tu búsqueda:</span>
                                    </div>
                                    
                                    <div class="fa_option fa_def fa_cursor" onclick="">
                                        <span>Todos registros</span>
                                    </div>

                                    <div class="fa_option fa_def" onclick="">
                                        <span>Clientes</span>
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

                </div><!--/#bl_buscar_clientes -->

                <div id="contenedor_clientes" class="wr_d_clientes wr_d_arts">

                    <div class="d_cliente d_art" data-tipo_art="cliente" data-id_cliente="5">
                        <div class="datos_cliente datos_art">
                            <div class="da_nombre">Nombre Apellido (Ejemplo)</div>
                            <div class="da_tel">622 315 345</div>
                            <div class="da_com">cliente fiel</div>
                        </div>

                        <div class="tres_puntos">
                            <img class="btn_img" src="./images/tres_puntos_vertical_white.svg">
                        </div>
                        <div class="tres_puntos_menu">
                            <div onclick="openModal('full','Cliente actual',null,'buildCliente',true, 'ver');">
                                <img class="img_acts img_ver" src="./images/img_ver_white_24x24.png">
                            </div>
                            <div onclick="openModal('full','Cliente actual',null,'buildCliente',true, 'editar');">
                                <img class="img_acts img_editar" src="./images/img_editar_white_24x24.png">
                            </div>
                            <div onclick="openModal('full','Cliente actual',null,'buildCliente',true, 'eliminar');">
                                <img class="img_acts img_eliminar" src="./images/img_eliminar_white_24x24.png">
                            </div>
                        </div>

                    </div>


                </div><!--/#contenedor_clientes -->

                <button id="btn_add_cliente" class="btn_add" onclick="openModal('full', 'Crear Cliente', null, 'buildCliente', true, 'nuevo');">+</button>

            </div><!--/#block_clientes_inner -->
        </div><!--/#block_clientes -->
