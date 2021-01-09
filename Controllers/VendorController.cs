using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AtmOneMonitoringLibrary.Interfaces;
using System.Threading.Tasks;
using System.Collections.Generic;
using AtmOneMonitoringLibrary.Dtos;

namespace AtmOneMonitorMVC.Controllers
{
  [Authorize]
  [Route("api/[controller]")]
  [ApiController]
  public class VendorController : ControllerBase
  {
    private readonly IVendorRepository vendorRepository;
    public VendorController(IVendorRepository vendorRepository)
    {
      this.vendorRepository = vendorRepository;
    }

    [HttpGet]
    public async Task<IActionResult> GetVendors()
    {
      List<VendorDTO> vendors = await vendorRepository.GetVendors();
      return Ok(vendors);
    }

  }
}