
import React from 'react';

const SidebarFiltros = ({
  filtros,
  ChecksList,
  CoresDisponiveis,
  mapaCores,
  handleCheckboxChange,
  handlePrecoChange,
  limparFiltros,
  removerFiltro
}) => {
  const temFiltrosAtivos =
    filtros.categorias.length > 0 ||
    filtros.subcategorias.length > 0 ||
    filtros.tamanhos.length > 0 ||
    filtros.cores.length > 0 ||
    filtros.preco[0] !== 0 ||
    filtros.preco[1] !== 2600;

  return (
    <aside className="sidebar">
      {temFiltrosAtivos && (
        <div className="filtros-aplicados-container">
          <div className="filtros-aplicados-top">
            <span>FILTROS APLICADOS:</span>
            <button className="limpar-tudo-btn" onClick={limparFiltros}>Limpar tudo</button>
          </div>
          <div className="filtros-lista">
            {filtros.categorias.map(cat => (
              <button key={`cat-${cat}`} className="filtro-btn" onClick={() => removerFiltro('categorias', cat)}>× {cat}</button>
            ))}
            {filtros.subcategorias.map(sub => (
              <button key={`sub-${sub}`} className="filtro-btn" onClick={() => removerFiltro('subcategorias', sub)}>× {sub}</button>
            ))}
            {filtros.tamanhos.map(tam => (
              <button key={`tam-${tam}`} className="filtro-btn" onClick={() => removerFiltro('tamanhos', tam)}>× {tam}</button>
            ))}
            {filtros.cores.map(cor => (
              <button key={`cor-${cor}`} className="filtro-btn" onClick={() => removerFiltro('cores', cor)}>× {cor}</button>
            ))}
            {(filtros.preco[0] !== 0 || filtros.preco[1] !== 2600) && (
              <button className="filtro-btn" onClick={() => removerFiltro('preco')}>
                × R$ {filtros.preco[0]} - R$ {filtros.preco[1]}
              </button>
            )}
          </div>
        </div>
      )}

      {ChecksList.map((item, index) => (
        <details key={index}>
          <summary>{item.title}</summary>
          {item.categoriaTamanho ? (
            item.categoriaTamanho.map((subItem, subIndex) => (
              <details key={subIndex} className="tamanho-filtros" open>
                <summary>{subItem.tipo}</summary>
                <ul className="lista-composta">
                  {subItem.checksLists.map((check, i) => (
                    <li key={i}>
                      <label>
                        <input
                          type="checkbox"
                          checked={filtros.tamanhos.includes(check)}
                          onChange={() => handleCheckboxChange("tamanhos", check)}
                        /> {check}
                      </label>
                    </li>
                  ))}
                </ul>
              </details>
            ))
          ) : (
            <ul className="lista-simples">
              {item.checksLists.map((check, i) => (
                <li key={i}>
                  <label>
                    <input
                      type="checkbox"
                      checked={filtros[item.tipo]?.includes(check)}
                      onChange={() => handleCheckboxChange(item.tipo, check)}
                    /> {check}
                  </label>
                </li>
              ))}
            </ul>
          )}
        </details>
      ))}

      <details className='details-cor'>
        <summary>Cor</summary>
        <div className="filtros-cor">
          {CoresDisponiveis.map((cor, index) => {
            const isChecked = filtros.cores.includes(cor);
            return (
              <label key={index} className="cor-label">
                <input
                  type="checkbox"
                  value={cor}
                  checked={isChecked}
                  onChange={() => handleCheckboxChange("cores", cor)}
                />
                <span
                  className="cor-circulo"
                  style={{
                    backgroundColor: mapaCores[cor] || "transparent",
                    border: cor === "Branco" ? "1px solid #888" : "none",
                  }}
                />
                {cor}
              </label>
            );
          })}
        </div>
      </details>

      <div className='faixa-preco'>
        <h2 className='preco-filtro'>Faixas de preço</h2>
        <div className="range-wrapper">
          <div className="range-background"></div>
          <div
            className="range-highlight"
            style={{
              left: `${(filtros.preco[0] / 2600) * 100}%`,
              width: `${((filtros.preco[1] - filtros.preco[0]) / 2600) * 100}%`,
            }}
          />
          <input
            type="range"
            min="0"
            max="2600"
            step="10"
            value={filtros.preco[0]}
            onChange={(e) => handlePrecoChange(e, 0)}
          />
          <input
            type="range"
            min="0"
            max="2600"
            step="10"
            value={filtros.preco[1]}
            onChange={(e) => handlePrecoChange(e, 1)}
          />
        </div>
        <div className="range-valores">
          <span>R$ {filtros.preco[0]}</span>
          <span>R$ {filtros.preco[1]}</span>
        </div>
      </div>
    </aside>
  );
};

export default SidebarFiltros;
