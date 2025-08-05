namespace ChatAppWithRoomApi.DTO
{
    public class ApiResponse<T>
    {
        public string? Message { get; set; }
        public bool Status { get; set; } = true;
        public T? Result { get; set; }

    }
}
