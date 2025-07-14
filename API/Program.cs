using Core.Interfaces;
using API.Services;
using Core.Models.DTO_s;

var builder = WebApplication.CreateBuilder(args);

// Adiciona controllers
builder.Services.AddControllers();

// Configura AutoMapper
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
builder.Services.AddScoped<ICupomService, CupomService>();

// Configura CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins(
                "http://localhost:5173",
                "https://artenza.netlify.app",
                "https://artenza.onrender.com"
            )
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    var xmlFile = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    options.IncludeXmlComments(xmlPath);
});

var app = builder.Build();

// Necessário para o pipeline funcionar direito
app.UseRouting();

// Aplica CORS (deve estar entre UseRouting e UseEndpoints/MapControllers)
app.UseCors();

app.UseHttpsRedirection();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();

app.MapControllers();

app.Run();
