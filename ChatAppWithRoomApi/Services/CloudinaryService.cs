using ChatAppWithRoomApi.Models;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.Extensions.Options;

namespace ChatAppWithRoomApi.Services
{
    public interface ICloudinaryService
    {
        Task<string> UploadFileAsync(IFormFile file);
    }
    public class CloudinaryService : ICloudinaryService
    {

        private readonly Cloudinary _cloudinary;

        public CloudinaryService(IOptions<CloudinarySettings> config)
        {
            var account = new Account
            (
                config.Value.CloudName.Trim(),
                config.Value.ApiKey.Trim(),
                config.Value.ApiSecret.Trim()
            );

            _cloudinary = new Cloudinary( account );
        }

        public async Task<string> UploadFileAsync(IFormFile file)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("File is empty");

            const long maxSize = 5 * 1024 * 1024; 
            if (file.Length > maxSize)
                throw new ArgumentException("File size exceeds 5 MB limit");

            await using var stream = file.OpenReadStream();

            var uploadParams = new RawUploadParams
            {
                File = new FileDescription(file.FileName, stream),
                Folder = "project_chatapp_uploads"
            };

            var uploadResult = await _cloudinary.UploadAsync(uploadParams);

            if (uploadResult.Error != null)
                throw new Exception($"Cloudinary upload error: {uploadResult.Error.Message}");

            return uploadResult.SecureUrl?.AbsoluteUri
                   ?? throw new Exception("Upload succeeded but no SecureUrl returned");
        }




    }
}


