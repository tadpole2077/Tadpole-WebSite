using Angular_VS_TEST.ServiceClass;
using static Azure.Core.HttpHeader;

var builder = WebApplication.CreateBuilder(args);
//ConfigurationManager configuration = builder.Configuration;

// Add services to the container.
builder.Services.AddControllersWithViews();
//builder.Services.AddDbContext<FooDbContext>();         // inject dbContext into service controller - allow context to initiate when first used

//builder.Services.AddDbContext<MyDbContext>(options => options.UseSqlServer(configuration.GetConnectionString("ConnStr")));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
}
ServiceCommon.AssignSetting(app.Environment.IsDevelopment());
//serviceCommon.SetSystemSetting(ServiceCommon.SECURE_TOKEN, SETTING_CODE.SHUTDOWN_PENDING, 0);   // Reset setting to active system on startup

app.UseStaticFiles();
app.UseRouting();

app.MapControllerRoute(
    name: "default",
    pattern: "api/{controller}/{id?}");
    //pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html");

app.Run();
