using Core.Interfaces;
using API.Services;
using Core.Models.DTO_s;

var builder = WebApplication.CreateBuilder(args);

// Adiciona controllers
builder.Services.AddControllers();

// Configura o AutoMapper
builder.Services.AddAutoMapper(typeof(MappingProfile));

// Registro dos serviços
builder.Services.AddScoped<IUsuarioService, UsuarioService>();
builder.Services.AddScoped<IProdutoService, ProdutoService>();
builder.Services.AddScoped<IFuncionarioService, FuncionarioService>();
builder.Services.AddScoped<IEnderecoService, EnderecoService>();
builder.Services.AddScoped<ITransacaoService, TransacaoService>();
builder.Services.AddScoped<IVendaService, VendaService>();
builder.Services.AddScoped<ICarrinhoService, CarrinhoService>();
builder.Services.AddScoped<IFeedbackService, FeedbackService>();

// Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    var xmlFile = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    options.IncludeXmlComments(xmlPath);
});

// Configuração do CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("PermitirTudo", policy =>
    {
        policy.WithOrigins("http://localhost:5174") // Porta correta do seu frontend Vite/React
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Redirecionamento para HTTPS
app.UseHttpsRedirection();

// Aplicar CORS (antes de Authorization)
app.UseCors("PermitirTudo");

// Swagger apenas no modo de desenvolvimento
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Autorização (caso você venha a usar [Authorize])
app.UseAuthorization();

// Mapear os endpoints dos controllers
app.MapControllers();

// Inicia o app
app.Run();
