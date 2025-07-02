using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Printing;
using System.Linq;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using System.Windows.Media;
using test_comanda.Models;
using test_comanda.Views;

namespace test_comanda
{
    public partial class MainWindow : Window
    {
        private readonly ApiService _apiService = new();
        private List<Categoria> _categorias = new();
        private List<Producto> _productos = new();

        public MainWindow()
        {
            InitializeComponent();
            Loaded += MainWindow_Loaded;
        }

        private async void MainWindow_Loaded(object sender, RoutedEventArgs e)
        {
            try
            {
                await LoadInitialData();
            }
            catch (Exception ex)
            {
                HandleCriticalError("Error al cargar la aplicación", ex, true);
            }
        }

        private async Task LoadInitialData()
        {
            try
            {
                // Mostrar indicador de carga
                SetLoadingState(true);

                // Cargar categorías con reintentos
                _categorias = await ExecuteWithRetry(
                    () => _apiService.GetCategoriasAsync(),
                    "categorías",
                    maxRetries: 3
                );

                if (_categorias?.Count > 0)
                {
                    CategoriasListBox.ItemsSource = _categorias;
                }
                else
                {
                    ShowWarning("No se encontraron categorías disponibles");
                }

                // Inicializar ComboBox de mesa
                MesaComboBox.ItemsSource = Enumerable.Range(1, 100).ToList();
                MesaComboBox.SelectedIndex = 0;

                // Cargar meseros con reintentos
                var meseros = await ExecuteWithRetry(
                    () => _apiService.GetMeserosAsync(),
                    "meseros",
                    maxRetries: 3
                );

                if (meseros?.Count > 0)
                {
                    MeseroComboBox.ItemsSource = meseros;
                    MeseroComboBox.SelectedIndex = 0;
                }
                else
                {
                    ShowWarning("No se encontraron meseros disponibles");
                }
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error al cargar datos iniciales", ex);
            }
            finally
            {
                SetLoadingState(false);
            }
        }

        private async void CategoriasListBox_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (CategoriasListBox.SelectedItem is not Categoria categoria)
                return;

            try
            {
                SetLoadingState(true);

                _productos = await ExecuteWithRetry(
                    () => _apiService.GetProductosAsync(categoria._id),
                    $"productos de la categoría {categoria.nombre}",
                    maxRetries: 2
                );

                ProductosListBox.ItemsSource = _productos;
            }
            catch (Exception ex)
            {
                HandleError($"Error al cargar productos de {categoria.nombre}", ex);
                ProductosListBox.ItemsSource = null;
            }
            finally
            {
                SetLoadingState(false);
            }
        }
        private void ProductosListBox_MouseLeftButtonUp(object sender, MouseButtonEventArgs e)
        {
            try
            {
                var listBox = (ListBox)sender;
                var point = e.GetPosition(listBox);
                var element = listBox.InputHitTest(point) as DependencyObject;

                while (element != null && !(element is ListBoxItem))
                    element = VisualTreeHelper.GetParent(element);

                if (element is ListBoxItem item)
                {
                    var producto = item.DataContext as Producto;
                    if (producto != null)
                    {
                        AddProductToComanda(producto);
                        RefreshComandaDisplay();
                    }
                }
            }
            catch (Exception ex)
            {
                HandleError("Error al agregar producto a la comanda", ex);
            }
        }
        private void AddProductToComanda(Producto producto)
        {
            if (producto?.categoriaId == null)
            {
                ShowWarning("El producto no tiene una categoría válida");
                return;
            }

            try
            {
                // Determinar la sección (COCINA o BARRA)
                string seccion = producto.categoriaId.impresora?.ToUpper() ?? "BARRA";

                var comandaSeccion = seccion == "COCINA"
                    ? EstadoGlobal.ComandaActual.ProductosCocina
                    : EstadoGlobal.ComandaActual.ProductosBarra;

                var existente = comandaSeccion.Find(p => p._id == producto._id);

                if (existente != null)
                {
                    existente.Cantidad++;
                }
                else
                {
                    comandaSeccion.Add(new Producto
                    {
                        _id = producto._id,
                        nombre = producto.nombre,
                        codigo = producto.codigo,
                        categoriaId = producto.categoriaId,
                        Cantidad = 1
                    });
                }
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException($"Error al agregar producto {producto.nombre} a la comanda", ex);
            }
        }

        private async void SolicitarButton_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                if (!ValidateComanda())
                    return;

                var resumen = GenerateComandaSummary();
                var result = MessageBox.Show(
                    "Comanda a enviar:\n" + resumen,
                    "Confirmar envío",
                    MessageBoxButton.OKCancel,
                    MessageBoxImage.Question);

                if (result != MessageBoxResult.OK)
                    return;

                SetLoadingState(true);

                // Preparar datos de la comanda
                var comandaData  = PrepareComandaData() as test_comanda.Models.Comanda;

                // Enviar comanda con reintentos
                var respuesta = await ExecuteWithRetry(
                    () => _apiService.EnviarComandaAsync(comandaData),
                    "envío de comanda",
                    maxRetries: 2
                );

                // Mostrar confirmación
                string mensaje = "Comanda enviada exitosamente!";

                if (respuesta.newComandaBarra != null)
                    mensaje += $"\nCódigo de comanda Barra: {respuesta.newComandaBarra.codigo}";

                if (respuesta.newComandaCocina != null)
                    mensaje += $"\nCódigo de comanda Cocina: {respuesta.newComandaCocina.codigo}";

                if (respuesta.comanda != null && respuesta.newComandaBarra == null && respuesta.newComandaCocina == null)
                    mensaje += $"\nCódigo de comanda: {respuesta.comanda.codigo}";

                MessageBox.Show(mensaje, "Éxito", MessageBoxButton.OK, MessageBoxImage.Information);
                // Imprimir comandas por impresora
                await PrintComandas(respuesta.newComandaBarra, respuesta.newComandaCocina);

                // Limpiar comanda actual
                ClearComanda();
            }
            catch (Exception ex)
            {
                HandleError("Error al procesar la comanda", ex);
            }
            finally
            {
                SetLoadingState(false);
            }
        }

        private bool ValidateComanda()
        {
            try
            {
                if (EstadoGlobal.ComandaActual.ProductosCocina.Count == 0 &&
                    EstadoGlobal.ComandaActual.ProductosBarra.Count == 0)
                {
                    ShowWarning("Agregue al menos un producto a la comanda");
                    return false;
                }

                if (MesaComboBox.SelectedItem == null)
                {
                    ShowWarning("Seleccione una mesa");
                    return false;
                }

                if (MeseroComboBox.SelectedItem == null)
                {
                    ShowWarning("Seleccione un mesero");
                    return false;
                }

                return true;
            }
            catch (Exception ex)
            {
                HandleError("Error al validar la comanda", ex);
                return false;
            }
        }

        private string GenerateComandaSummary()
        {
            try
            {
                var summary = new System.Text.StringBuilder();

                summary.AppendLine($"Mesa: {MesaComboBox.SelectedItem}");
                summary.AppendLine($"Mesero: {(MeseroComboBox.SelectedItem as Mesero)?.codigo}");
                summary.AppendLine();

                if (EstadoGlobal.ComandaActual.ProductosCocina.Count > 0)
                {
                    summary.AppendLine("COCINA:");
                    foreach (var p in EstadoGlobal.ComandaActual.ProductosCocina)
                        summary.AppendLine($"  {p.nombre} x{p.Cantidad}");
                    summary.AppendLine();
                }

                if (EstadoGlobal.ComandaActual.ProductosBarra.Count > 0)
                {
                    summary.AppendLine("BARRA:");
                    foreach (var p in EstadoGlobal.ComandaActual.ProductosBarra)
                        summary.AppendLine($"  {p.nombre} x{p.Cantidad}");
                }

                return summary.ToString();
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException("Error al generar resumen de comanda", ex);
            }
        }

        private object PrepareComandaData()
        {
            try
            {
                var mesa = (int)(MesaComboBox.SelectedItem ?? 1);
                var mesero = MeseroComboBox.SelectedItem as Mesero;

                return new test_comanda.Models.Comanda
                {
                    mesa = mesa.ToString(), // Convertir a string ya que la propiedad Mesa es string
                    mesero = mesero?.codigo,
                    ProductosCocina = EstadoGlobal.ComandaActual.ProductosCocina,
                    ProductosBarra = EstadoGlobal.ComandaActual.ProductosBarra
                };
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException("Error al preparar datos de la comanda", ex);
            }
        }

        private async Task PrintComandas(dynamic cocina, dynamic barra)
        {
            var printTasks = new List<Task>();

            try
            {
                if (EstadoGlobal.ComandaActual.ProductosCocina.Count > 0)
                {
                    printTasks.Add(Task.Run(() =>
                        PrintComandaPorImpresora("COCINA", EstadoGlobal.ComandaActual.ProductosCocina, cocina)));
                }

                if (EstadoGlobal.ComandaActual.ProductosBarra.Count > 0)
                {
                    printTasks.Add(Task.Run(() =>
                        PrintComandaPorImpresora("BARRA", EstadoGlobal.ComandaActual.ProductosBarra, barra)));
                }

                await Task.WhenAll(printTasks);
            }
            catch (Exception ex)
            {
                HandleError("Error durante la impresión", ex);
            }
        }

        private void PrintComandaPorImpresora(string impresora, List<Producto> productos, dynamic comanda)
        {
            try
            {
                PrintDocument printDoc = new PrintDocument();
                printDoc.PrinterSettings.PrinterName = impresora;

                if (!printDoc.PrinterSettings.IsValid)
                {
                    throw new InvalidOperationException($"No se encontró la impresora {impresora}");
                }

                var mesa = (int)(MesaComboBox.SelectedItem ?? 1);
                var mesero = MeseroComboBox.SelectedItem as Mesero;

                printDoc.PrintPage += (s, ev) => PrintComandaPage(ev, productos, comanda, mesa, mesero, impresora);
                printDoc.Print();
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException($"Error al imprimir en {impresora}", ex);
            }
        }

        private void PrintComandaPage(PrintPageEventArgs e, List<Producto> productos, dynamic comanda,
                                     int mesa, Mesero mesero, string impresora)
        {
            try
            {
                Graphics g = e.Graphics;
                var fontTitulo = new System.Drawing.Font("Arial", 14, System.Drawing.FontStyle.Bold);
                var fontTexto = new Font("Arial", 10);
                var brush = System.Drawing.Brushes.Black;

                float y = 20;
                float lineHeight = 25;

                // Encabezado
                g.DrawString($"COMANDA - {impresora}", fontTitulo, brush, 10, y);
                y += lineHeight * 1.5f;

                g.DrawString($"Código: {comanda.codigo}", fontTexto, brush, 10, y);
                y += lineHeight;

                g.DrawString($"Mesa: {mesa}", fontTexto, brush, 10, y);
                y += lineHeight;

                g.DrawString($"Mesero: {mesero?.codigo}", fontTexto, brush, 10, y);
                y += lineHeight;

                g.DrawString($"Fecha: {DateTime.Now:dd/MM/yyyy HH:mm:ss}", fontTexto, brush, 10, y);
                y += lineHeight * 1.5f;

                // Línea separadora
                g.DrawString(new string('-', 40), fontTexto, brush, 10, y);
                y += lineHeight;

                // Productos
                foreach (var producto in productos)
                {
                    g.DrawString($"{producto.nombre} x{producto.Cantidad}", fontTexto, brush, 10, y);
                    y += lineHeight;
                }

                // Línea separadora final
                y += lineHeight;
                g.DrawString(new string('-', 40), fontTexto, brush, 10, y);
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException("Error al generar página de impresión", ex);
            }
        }

        private void EliminarProducto_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                if (sender is not Button btn || btn.Tag is not Producto producto)
                    return;

                RemoveProductFromComanda(producto);
                RefreshComandaDisplay();
                ActualizarEstadoBotonSolicitar();
            }
            catch (Exception ex)
            {
                HandleError("Error al eliminar producto", ex);
            }
        }

        private void RemoveProductFromComanda(Producto producto)
        {
            try
            {
                // Buscar en ambas secciones
                var existenteCocina = EstadoGlobal.ComandaActual.ProductosCocina.Find(p => p._id == producto._id);
                var existenteBarra = EstadoGlobal.ComandaActual.ProductosBarra.Find(p => p._id == producto._id);

                if (existenteCocina != null)
                {
                    if (existenteCocina.Cantidad == 1)
                        EstadoGlobal.ComandaActual.ProductosCocina.Remove(existenteCocina);
                    else
                        existenteCocina.Cantidad--;
                }
                else if (existenteBarra != null)
                {
                    if (existenteBarra.Cantidad == 1)
                        EstadoGlobal.ComandaActual.ProductosBarra.Remove(existenteBarra);
                    else
                        existenteBarra.Cantidad--;
                }
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException($"Error al eliminar producto {producto.nombre}", ex);
            }
        }

        private void RefreshComandaDisplay()
        {
            try
            {
                // Combinar productos de ambas secciones para mostrar
                var todosProductos = new List<Producto>();
                todosProductos.AddRange(EstadoGlobal.ComandaActual.ProductosCocina);
                todosProductos.AddRange(EstadoGlobal.ComandaActual.ProductosBarra);

                ComandaListBox.ItemsSource = null;
                ComandaListBox.ItemsSource = todosProductos;
                ActualizarEstadoBotonSolicitar();
            }
            catch (Exception ex)
            {
                HandleError("Error al actualizar la vista de comanda", ex);
            }
        }

        private void ActualizarEstadoBotonSolicitar()
        {
            try
            {
                SolicitarButton.IsEnabled =
                    EstadoGlobal.ComandaActual.ProductosCocina.Count > 0 ||
                    EstadoGlobal.ComandaActual.ProductosBarra.Count > 0;
            }
            catch (Exception ex)
            {
                HandleError("Error al actualizar estado del botón", ex);
                SolicitarButton.IsEnabled = false;
            }
        }

        // Métodos de utilidad para manejo de errores
        private async Task<T> ExecuteWithRetry<T>(Func<Task<T>> operation, string operationName, int maxRetries = 3)
        {
            Exception lastException = null;

            for (int attempt = 1; attempt <= maxRetries; attempt++)
            {
                try
                {
                    return await operation();
                }
                catch (Exception ex)
                {
                    lastException = ex;

                    if (attempt == maxRetries)
                        break;

                    // Espera progresiva entre reintentos
                    await Task.Delay(1000 * attempt);
                }
            }

            throw new InvalidOperationException(
                $"Error al {operationName} después de {maxRetries} intentos",
                lastException);
        }

        private void HandleError(string message, Exception ex, bool showToUser = true)
        {
            // Log del error (aquí podrías integrar tu sistema de logging)
            System.Diagnostics.Debug.WriteLine($"ERROR: {message} - {ex}");

            if (showToUser)
            {
                MessageBox.Show(
                    $"{message}\n\nDetalle: {ex.Message}",
                    "Error",
                    MessageBoxButton.OK,
                    MessageBoxImage.Error);
            }
        }

        private void HandleCriticalError(string message, Exception ex, bool exitApp = false)
        {
            var fullMessage = $"{message}\n\nLa aplicación podría comportarse de manera inesperada.\n\nDetalle: {ex.Message}";

            MessageBox.Show(fullMessage, "Error Crítico", MessageBoxButton.OK, MessageBoxImage.Error);

            if (exitApp)
            {
                var result = MessageBox.Show(
                    "¿Desea cerrar la aplicación?",
                    "Error Crítico",
                    MessageBoxButton.YesNo,
                    MessageBoxImage.Question);

                if (result == MessageBoxResult.Yes)
                    Application.Current.Shutdown();
            }
        }

        private void ShowWarning(string message)
        {
            MessageBox.Show(message, "Advertencia", MessageBoxButton.OK, MessageBoxImage.Warning);
        }

        private void SetLoadingState(bool isLoading)
        {
            try
            {
                // Deshabilitar controles durante la carga
                CategoriasListBox.IsEnabled = !isLoading;
                ProductosListBox.IsEnabled = !isLoading;
                SolicitarButton.IsEnabled = !isLoading && (
                    EstadoGlobal.ComandaActual.ProductosCocina.Count > 0 ||
                    EstadoGlobal.ComandaActual.ProductosBarra.Count > 0);

                // Cambiar cursor
                Mouse.OverrideCursor = isLoading ? Cursors.Wait : null;
            }
            catch (Exception ex)
            {
                HandleError("Error al cambiar estado de carga", ex, false);
            }
        }

        private void ClearComanda()
        {
            try
            {
                EstadoGlobal.ComandaActual.ProductosCocina.Clear();
                EstadoGlobal.ComandaActual.ProductosBarra.Clear();
                RefreshComandaDisplay();
            }
            catch (Exception ex)
            {
                HandleError("Error al limpiar comanda", ex);
            }
        }

        // Resto de métodos existentes con manejo de errores mejorado...
        private async void AdminButton_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                var login = new AdminLoginWindow();
                login.AdminCrudClosed += () =>
                {
                    Task.Run(async () =>
                    {
                        try
                        {
                            await Dispatcher.InvokeAsync(() => RefreshCategorias());
                        }
                        catch (Exception ex)
                        {
                            HandleError("Error al actualizar datos después de administración", ex);
                        }
                    });
                };
                login.ShowDialog();
            }
            catch (Exception ex)
            {
                HandleError("Error al abrir ventana de administración", ex);
            }
        }

        public async void RefreshCategorias()
        {
            try
            {
                await LoadInitialData();
            }
            catch (Exception ex)
            {
                HandleError("Error al actualizar categorías", ex);
            }
        }
    }

    public static class EstadoGlobal
    {
        static EstadoGlobal()
        {
            ComandaActual = new Comanda();
        }

        public static Comanda ComandaActual { get; set; }
    }

    // Clase Comanda actualizada para manejar las dos secciones
    public class Comanda
    {
        public List<Producto> ProductosCocina { get; set; } = new();
        public List<Producto> ProductosBarra { get; set; } = new();
        public string mesero { get; set; }
        public string mesa { get; set; }
        // Mantener compatibilidad con código existente
        public List<Producto> Productos
        {
            get
            {
                var todos = new List<Producto>();
                todos.AddRange(ProductosCocina);
                todos.AddRange(ProductosBarra);
                return todos;
            }
        }
    }
}