class DimensionsValidator < ActiveModel::EachValidator
  def validate_each(record, attribute, value)
    queued_write = value.queued_for_write[:original]
      if record.send("#{attribute}?".to_sym) && !queued_write.nil?
        dimensions = Paperclip::Geometry.from_file(queued_write.path)
        width = options[:width]
        height = options[:height]

        record.errors[attribute] << "Width must be at least #{width}px" unless dimensions.width >= width
        record.errors[attribute] << "Height must be at least #{height}px" unless dimensions.height >= height
      end
  end
end