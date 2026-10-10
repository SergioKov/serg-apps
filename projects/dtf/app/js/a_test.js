function generarSQLInsertMultiple(datos, id_songbook, lang_val) {
    let values = [];

    datos.forEach(item => {
        
        const song_number = item.number ?? 'NULL';
        const title = item.title ? `'${item.title.replace(/'/g, "''")}'` : "''";
        const category = item.category ?? 0;
        const songbook = item.songbook ?? id_songbook;//mirar en bd
        const song_text = item.song_text ? `'${item.song_text.replace(/'/g, "''")}'` : "''";
        const tune = item.tune ? `'${item.tune.replace(/'/g, "''")}'` : "''";
        const tune_transpose = item.tune_transpose ? `'${item.tune_transpose.replace(/'/g, "''")}'` : "''";
        const tipo_acorde = item.tipo_acorde ? `'${item.tipo_acorde.replace(/'/g, "''")}'` : "''";
        const tipo_fuente = item.tipo_fuente ? `'${item.tipo_fuente.replace(/'/g, "''")}'` : "''";
        const url_youtube = item.url_youtube ? `'${item.url_youtube.replace(/'/g, "''")}'` : "''";
        const url_recurso = item.url_recurso ? `'${item.url_recurso.replace(/'/g, "''")}'` : "''";
        const tempo_bpm = item.tempo_bpm ? `'${item.tempo_bpm.replace(/'/g, "''")}'` : "''";
        const words = item.words ? `'${item.words.replace(/'/g, "''")}'` : "''";
        const music = item.music ? `'${item.music.replace(/'/g, "''")}'` : "''";
        const notes = item.notes ? `'${item.notes.replace(/'/g, "''")}'` : "''";
        const lang = `'${lang_val}'` ?? "''";//fijate en el nombre de songbook
        const count = item.count ?? 0;
        const created_at = convertirFecha(item.date) ?? 'NULL';

        values.push(`(${song_number}, ${title}, ${category}, ${songbook}, ${song_text}, ${tune}, ${tune_transpose}, ${tipo_acorde}, ${tipo_fuente}, ${url_youtube}, ${url_recurso}, ${tempo_bpm}, ${words}, ${music}, ${notes}, ${lang}, ${count}, ${created_at})`);
    });

    const sql = `INSERT INTO songs (song_number, title, category, songbook, song_text, tune, tune_transpose, tipo_acorde, tipo_fuente, url_youtube, url_recurso, tempo_bpm, words, music, notes, lang, count, created_at) VALUES ${values.join(',\r\n')};`;

    return sql;
}



async function getSong(id_song){
    const obj = await getDataSongFromBd();//IMPORTANTE para cojer todos los datos necesarios
    console.log('(getSong) --- obj: ', obj);
}


async function getLista(id_lista_pram){
    id_lista = id_lista_pram;
    const obj = await getDataListaFromBd();//IMPORTANTE para cojer todos los datos necesarios
    console.log('(getLista) --- obj: ', obj);
}


